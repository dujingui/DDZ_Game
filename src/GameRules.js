/**
 * 游戏规则类
 */

function GameRules(){
	if(typeof this.instance == 'object'){
		return this.instance;
	}

	this.instance = this;

	this.isRobFag 	= false;	//首次抢地主标记位
	this.CardNum 	= 54;

	this.newDiscardInfo = null;	//记录最新的出牌信息
	this.activePlayer = null;   //记录当前活跃的玩家

	this.state = null;

	this.Init = function(){
	},

	this.SetNewDiscardInfo = function(cardInfo){
		this.newDiscardInfo = cardInfo;
	},

	this.GetNewDiscardInfo = function(){
		return this.newDiscardInfo;
	},

	this.GetCurActivePlayer = function(){
		return this.activePlayer;
	},

	this.GetState = function(){
		return this.state;
	},

	//判断是否可以出选中的牌
	this.IsCanDiscard = function(selected_card){
		if(this.state === Game.GameState.GS_Discard){
			var info = CardUtil.IsCombination(selected_card);
			return info;
		}else if(this.state === Game.GameState.GS_FollowCard){
			var newDiscardInfo = this.newDiscardInfo;
			var type = newDiscardInfo.type;
			var info = CardUtil.combinationCards(selected_card, type);
			if(info === null || newDiscardInfo === null){
				return null;
			}

			if(info.value <= newDiscardInfo.value){
				return null;
			}

			return info;
		}
	},

	//开始游戏
	this.StartGame = function(){
	},

	//发牌
	this.Deal = function(){
		var tempPlayer = null;
		var cardid = null;
		var playerIndex = 0;
		//生成一副牌
		Game_Card_Mgr.createCards();
		//洗牌
		Game_Card_Mgr.shuffle();

		//发牌
		for(var i = 0;i < this.CardNum - 3;i ++){
			if(playerIndex >= 3){
				playerIndex = 0;
			}
			cardid = Game_Card_Mgr.getSoleIDByIndex(i);
			tempPlayer = PlayerMgr.GetPlayerByIndex(playerIndex ++);
			tempPlayer.deal(cardid);
		}

		//牌排序
		for(var i = 0;i < 3;i ++){
			tempPlayer = PlayerMgr.GetPlayerByIndex(i);
			Game_Card_Mgr.sort(tempPlayer.getCardList());
		}
	},

	//如指定参数则指定该参数对应的玩家开始叫牌，否则随机指定一名玩家开始叫牌,
	this.StartCallCard = function(playerid){
		var randomPlayerid = Util.GetRandomNum(1,3);;
		var callCardPlayerID = playerid || randomPlayerid;
		var player = PlayerMgr.GetPlayer(callCardPlayerID);
		if(player.isAI()){
			this.calcIsCallCard(callCardPlayerID);
		}
		this.activePlayer = callCardPlayerID;
		Game_Notify_Center.Publish(ObserverType.OT_START_CALL_CARD);
	},

	//有人出牌
	this.Discard = function(player_id){
		var player = PlayerMgr.GetPlayer(player_id);
		var nextPlayer = player.nextPlayer();

		if(nextPlayer.isAI()){
			this.calcFollowSuit(nextPlayer.getID());
		}else{
			this.state = Game.GameState.GS_FollowCard;
		}

		Game_Notify_Center.Publish(
			ObserverType.OT_START_FOLLOW_CARD,
			{player_id:nextPlayer.getID()}
		);
	},

	//设置某个玩家为地主
	this.setLandlord = function(playerid){
		var player = PlayerMgr.GetPlayer(playerid);
		player.setLandlord(true);
		Game_Notify_Center.Publish(ObserverType.OT_BECOME_LANDLORD,{player_id:playerid});
	},

	//通知某个玩家开始抢地主
	this.startRobLandlord = function(playerid){
		//如果叫过地主并且没有玩家抢地主,则直接指定为地主
		var _this = this;
		this.activePlayer = playerid;
		var player = PlayerMgr.GetPlayer(playerid);
		if(player.isCall() && !PlayerMgr.isHasPlayerRob()){
			player.setLandlord(true);
			setTimeout(function(){
				_this.setLandlord(playerid);
		},1000)
			return;
		}
		if(player.isAI()){
			this.calcIsRobLandlord(playerid);
		}
		Game_Notify_Center.Publish(
			ObserverType.OT_START_ROB_LANDLORD,
			{player_id:playerid}
		);
	},

	//计算是否叫地主结束调用
	this.callLandlord = function(isCall){
		var playerid = this.activePlayer;
		var player = PlayerMgr.GetPlayer(playerid);
		player.setIsCall(isCall);

		Game_Notify_Center.Publish(
			ObserverType.OT_CALL_CARD,
			{is_call:isCall}
		);

		if(isCall){
			this.startRobLandlord(player.next());
		}else{
			this.StartCallCard(player.next());
		}
	},

	//抢地主
	this.robLandlord = function(id,isRob){
		var playerid = id;
		var player = PlayerMgr.GetPlayer(playerid);
		player.setIsRob(isRob);
		if(player.isCall()){
			if(isRob){
				playerid = id;
			}else{
				var players = PlayerMgr.getRobPlayers();
				if(players.length >=2){
					playerid = PlayerMgr.GetFirstRobPlayer();
				}else{
					playerid = players[0];
				}
			}
			this.setLandlord(playerid);
		}else{
			this.startRobLandlord(player.next());
		}
	},

	//有人不出牌
	this.notFollowCards = function(playerid){
		var player = PlayerMgr.GetPlayer(playerid);
		var nextPlayer = player.nextPlayer();

		var discardInfo = this.GetNewDiscardInfo();
		if(!discardInfo || !discardInfo.cards || discardInfo.cards.length<=0){
			throw new Error("获取不到出牌信息！");
		}

		if(this.isPlayerDiscard(nextPlayer.getID(), discardInfo)){
			//没人跟牌，就继续出牌
			if(nextPlayer.isAI()){
				this.calcDiscard(nextPlayer.getID());
			}else{
				this.state = Game.GameState.GS_Discard;
			}
			Game_Notify_Center.Publish(
				ObserverType.OT_START_DISCARD,
				{player_id:nextPlayer.getID()}
			);
			return;
		}

		if(nextPlayer.isAI()){
			this.calcFollowSuit(nextPlayer.getID());
		}

		Game_Notify_Center.Publish(
			ObserverType.OT_START_FOLLOW_CARD,
			{player_id:nextPlayer.getID()}
		);
	},

	//根据出牌信息判断是否是某个玩家出的牌
	this.isPlayerDiscard = function(playerid,discardInfo){
		var player = PlayerMgr.GetPlayer(playerid);
		var soleid = discardInfo.cards[0];
		return player.isBelongSelf(soleid);
	},

	//拆牌
	this.splitCards = function(id){
		var player = PlayerMgr.GetPlayer(id);
		var cards = player.getCardList().slice(0);
		var playerGroups = player.getCardTypeGroup();
		player.setIsSplit(true);
		// /**********用于测试**********/
		// var temp = this._cardMgr.createCards();
		// this._cardMgr.shuffle();
		// temp.splice(17, 37);
		// var cards = [];
		// for(var i = 0;i < temp.length;i ++){
		// 	cards.push(temp[i].soleID);
		// }
		// /********************************/

		var cardList_1 = [];
		var cardList_2 = [];
		var cardList_3 = [];
		var cardList_4 = [];

		for(var i = 0;i < cards.length;){
			var cardData = Game_Card_Mgr.getCardData(cards[i]);
			var cardNumID = cardData.numID;
			if(!CardUtil.isContain(cardList_1,cardNumID)){
				cardList_1.push(cardData.soleID);
				cards.splice(i,1);
			}else if(!CardUtil.isContain(cardList_2,cardNumID)){
				cardList_2.push(cardData.soleID);
				cards.splice(i,1);
			}else if(!CardUtil.isContain(cardList_3,cardNumID)){
				cardList_3.push(cardData.soleID);
				cards.splice(i,1);
			}else if(!CardUtil.isContain(cardList_4,cardNumID)){
				cardList_4.push(cardData.soleID);
				cards.splice(i,1);
			}
		}

		var rocketGroups = [];//火箭组
		var bombGroups = [];//炸弹组
		var threeGroups = [];//3牌组
		var doubleGroups = [];//双牌组
		var singleGroups = [];//单牌组
		var singleStraigleGroups = [];	//单顺组
		var threeAndOneGroups = [];

		//首先提取炸弹
		for(var i = 0;i < cardList_4.length; ){
			var cardSoleID = cardList_4[i];
			var numID = Game_Card_Mgr.getCardData(cardSoleID).numID;
			cardList_4.splice(i,1);

			var soleID3 = CardUtil.removeEleByNumID(cardList_3,numID);
			var soleID2 = CardUtil.removeEleByNumID(cardList_2,numID);
			var soleID1 = CardUtil.removeEleByNumID(cardList_1,numID);

			var bombGroup = [];
			bombGroup.push(soleID1, soleID2, soleID3, cardSoleID);
			bombGroups.push(bombGroup);
		}
		//再提取3牌组
		for(var i = 0;i < cardList_3.length;){
			var cardSoleID = cardList_3[i];
			var numID = Game_Card_Mgr.getCardData(cardSoleID).numID;
			cardList_3.splice(i,1);

			var soleID2 = CardUtil.removeEleByNumID(cardList_2,numID);
			var soleID1 = CardUtil.removeEleByNumID(cardList_1,numID);
			var threeGroup = [];
			threeGroup.push(soleID1, soleID2, cardSoleID);
			threeGroups.push(threeGroup);
		}
		//再提取2牌组
		for(var i = 0;i < cardList_2.length;){
			var cardSoleID = cardList_2[i];
			var numID = Game_Card_Mgr.getCardData(cardSoleID).numID;
			cardList_2.splice(i,1);

			var soleID1 = CardUtil.removeEleByNumID(cardList_1,numID);
			var doubleGroup = [];
			doubleGroup.push(soleID1, cardSoleID);
			doubleGroups.push(doubleGroup);
		}
		//再提取火箭
		if(CardUtil.isContain(cardList_1, 14) && CardUtil.isContain(cardList_1, 15)){
			CardUtil.removeEleByNumID(cardList_1, 14);
			CardUtil.removeEleByNumID(cardList_1, 15);
			var rocketGroup = [];
			rocketGroup.push(53, 54);
			rocketGroups.push(rocketGroup);
		}
		//再提取单牌组
		for(var i = 0;i < cardList_1.length;){
			var cardSoleID = cardList_1[i];
			var numID = Game_Card_Mgr.getCardData(cardSoleID);
			cardList_1.splice(i,1);

			var singleGroup = [];
			singleGroup.push(cardSoleID);
			singleGroups.push(singleGroup);
		}
		//对牌型组进行排序(从小到大)
		CardUtil.sortCardGroup(bombGroups);
		CardUtil.sortCardGroup(threeGroups);
		CardUtil.sortCardGroup(doubleGroups);
		CardUtil.sortCardGroup(singleGroups);

		//提取3带1
		for(var i = 0;i < threeGroups.length;){
			var three = threeGroups.splice(i,1)[0];
			var one = singleGroups.splice(i,1)[0];
			var threeAndOne = CardUtil.mergeArray(three,one);
			threeAndOneGroups.push(threeAndOne);
		}

		var count = 1;
		var startIndex = 0;
		//提取单顺
		for(var i = 0;i < singleGroups.length - 1;i ++){
			var card1 = singleGroups[i][0];
			var card2 = singleGroups[i+1][0];
			var numid1 = Game_Card_Mgr.getCardData(card1).numID;
			var numid2 = Game_Card_Mgr.getCardData(card2).numID;
			if(numid1 === (numid2 - 1)){
				count ++;
				if(i+1 === singleGroups.length - 1){
					if(count >= 5){
						var tempArr = [];
						for(var j = startIndex;j < startIndex+count;j++){
							var tempSoleID = singleGroups[j][0];
							tempArr.push(tempSoleID);
						}
						singleGroups.splice(startIndex, count);
						singleStraigleGroups.push(tempArr);
						tempArr = null;
						i = 0;
					}else{
						count = 1;
						startIndex = i + 1;
					}
				}
			}else{
				if(count >= 5){
					var tempArr = [];
					for(var j = startIndex;j < startIndex+count;j++){
						var tempSoleID = singleGroups[j][0];
						tempArr.push(tempSoleID);
					}
					singleGroups.splice(startIndex, count);
					singleStraigleGroups.push(tempArr);
					tempArr = null;
					i = 0;
				}else{
					count = 1;
					startIndex = i + 1;
				}
			}
		}

		playerGroups.setSigleCardGroups(singleGroups);
		playerGroups.setSigleStraightGroups(singleStraigleGroups);
		playerGroups.setDoubleCardGroups(doubleGroups);
		playerGroups.setDoubleStraightGroupss(null);
		playerGroups.setThreeAndOneGroups(threeAndOneGroups);
		playerGroups.setBombGroups(bombGroups);
		playerGroups.setRocketGroups(rocketGroups);
		// playerGroups.printCards();
	},

	//计算是否叫牌 AI使用
	this.calcIsCallCard = function(id){
		var _this = this;
		var isCall = Util.GetRandomNum(0,1);
		setTimeout(function(){
			_this.callLandlord(isCall);
		},1000);
	},

	//计算是否抢地主 AI使用
	this.calcIsRobLandlord = function(id){
		var _this = this;
		var player = PlayerMgr.GetPlayer(id);
		var isRob = Util.GetRandomNum(0,1);
		setTimeout(function(){
			Game_Notify_Center.Publish(ObserverType.OT_ROB_LANDLORD,{player_id:id,is_rob:isRob});
			_this.robLandlord(id,isRob);
		},1000);

		if(isRob && !this.isRobFag){
			PlayerMgr.SetFirstRobPlayer(id);
			this.isRobFag = true;
		}
		player.setIsRob(isRob);
	},

	//计算如何出牌 AI使用
	this.calcDiscard = function(id){
		var player = PlayerMgr.GetPlayer(id);
		if(!player.isSplit()){
			this.splitCards(id);
		}

		var cardsGroup = player.getCardTypeGroup();
		var descardInfo = cardsGroup.getMinCardInfo();

		this.newDiscardInfo = descardInfo;

		setTimeout(function(){
			cardsGroup.printCards();
			player.discard(descardInfo.cards);
			Game_Notify_Center.Publish(ObserverType.OT_DISCARD,{player_id:id});
		},2000);
	},

	//计算如何跟牌 AI使用
	this.calcFollowSuit = function(id){
		var player = PlayerMgr.GetPlayer(id);
		if(!player.isSplit()){
			this.splitCards(id);
		}
		
		var discardInfo = this.GetNewDiscardInfo();
		if(!discardInfo || !discardInfo.cards || discardInfo.cards.length<=0){
			throw new Error("获取不到出牌信息！");
		}

		var cardTypeGroup = player.getCardTypeGroup();
		var followCardInfo = cardTypeGroup.getFollowCardInfo(discardInfo);

		cardTypeGroup.printCards();

		var isFollow = true;
		if(!followCardInfo){
			isFollow = false;
		}else{
			this.newDiscardInfo = followCardInfo;
		}

		setTimeout(function(){
			if(isFollow){
				player.discard(followCardInfo.cards);
			}
			Game_Notify_Center.Publish(
				ObserverType.OT_FOLLOW_CARD,
				{player_id: id, isFollow: isFollow}
			);
		},2000);
	},

	//叫牌结束后调用
	this.CallCardOver = function(){
		var landlordID = PlayerMgr.GetLandlordPlayer();
		if(landlordID == -1){
			return;
		}
		var player = PlayerMgr.GetPlayer(landlordID);

		if(player.isAI()){
			this.calcDiscard(landlordID);
		}else{
			this.state = Game.GameState.GS_Discard;
		}
		Game_Notify_Center.Publish(ObserverType.OT_START_DISCARD,{player_id:landlordID});
	}
};

var Game_Rules = new GameRules();
Game_Rules.Init();