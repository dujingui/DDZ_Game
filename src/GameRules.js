/**
 * 游戏规则类
 */

function GameRules(){
	if(typeof this.instance == 'object'){
		return this.instance;
	}

	this.instance = this;

	this.isRobFag 	= false;	//抢地主标记位
	this.firstRob   = null; 	//首次抢地主的玩家
	this.CardNum 	= 54;

	this._cardMgr 	= new CardManager();

	this.Init = function(){
		this.initEvent();
	},

	//开始游戏
	this.startGame = function(){
	},

	//发牌
	this.deal = function(){
		var tempPlayer = null;
		var cardid = null;
		var playerIndex = 0;
		//生成一副牌
		this._cardMgr.createCards();
		//洗牌
		this._cardMgr.shuffle();

		//发牌
		for(var i = 0;i < this.CardNum - 3;i ++){
			if(playerIndex >= 3){
				playerIndex = 0;
			}
			cardid = this._cardMgr.getSoleIDByIndex(i);
			tempPlayer = PlayerMgr.GetPlayerByIndex(playerIndex ++);
			tempPlayer.deal(cardid);
		}

		//牌排序
		for(var i = 0;i < 3;i ++){
			tempPlayer = PlayerMgr.GetPlayerByIndex(i);
			this._cardMgr.sort(tempPlayer.getCardList());
		}
	},

	this.FirstRobPlayer = function(){
		return this.firstRob;
	},

	this.GetCardData = function(id){
		var cardData = this._cardMgr.getCardData(id);
		return cardData;
	},

	this.GetCardMgr = function(){
		return this._cardMgr;
	},

	//每帧刷新
	this.Update = function(){

	},

	//设置某个玩家为地主
	this.setLandlord = function(playerid){
		var player = PlayerMgr.GetPlayer(playerid);
		player.setLandlord(true);
		var cards = this.getBottomCard();
		Game_Notify_Center.Publish(ObserverType.OT_BECOME_LANDLORD,{player_id:playerid,cards:cards});
	},

	//如指定参数则指定该参数对应的玩家开始叫牌，否则随机指定一名玩家开始叫牌,
	this.startCallCard = function(playerid){
		var randomPlayerid = Util.GetRandomNum(1,3);;
		var callCardPlayerID = playerid || randomPlayerid;
		var player = PlayerMgr.GetPlayer(callCardPlayerID);
		if(player.isAI()){
			this.calcIsCallCard(callCardPlayerID);
		}
		//通知界面 开始叫牌
		Game_Notify_Center.Publish(ObserverType.OT_START_CALL_CARD,{player_id:callCardPlayerID});
	},

	//通知某个玩家开始抢地主
	this.startRobLandlord = function(playerid){
		//如果叫过地主并且没有玩家抢地主,则直接指定为地主
		var _this = this;
		var player = PlayerMgr.GetPlayer(playerid);
		if(player.isCall() && !this.isHasPlayerRob()){
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

	//获得抢过地主的玩家
	this.getRobPlayers = function(){
		var players = [];
		for(var i = 1;i <= 3;i ++){
			var player = PlayerMgr.GetPlayer(i);
			if(player.isRob()){
				players.push(i);
			}	
		}	
		return players;
	},

	//判断有没有玩家抢过地主
	this.isHasPlayerRob = function(){
		for(var i = 1;i <= 3;i ++){
			var player = PlayerMgr.GetPlayer(i);
			if(player.isRob()){
				return true;
			}
		}
		return false;
	},

	//叫地主
	this.callLandlord = function(playerid,isCall){
		var player = PlayerMgr.GetPlayer(playerid);
		player.setIsCall(isCall);
		if(isCall){
			this.startRobLandlord(player.next());
		}else{
			this.startCallCard(player.next());
		}
		Game_Notify_Center.Publish(
			ObserverType.OT_CALL_LANDLORD,
			{player_id:playerid,is_call:isCall}
		);
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
				var players = this.getRobPlayers();
				if(players.length >=2){
					playerid = this.FirstRobPlayer();
				}else{
					playerid = players[0];
				}
			}
			this.setLandlord(playerid);
		}else{
			this.startRobLandlord(player.next());
		}
	},

	//计算是否叫牌 AI使用
	this.calcIsCallCard = function(id){
		var _this = this;
		var isCall = Util.GetRandomNum(0,1);
		setTimeout(function(){
			Game_Notify_Center.Publish(ObserverType.ET_CALL_CARD,{id:id,is_call:isCall});
			_this.callLandlord(id,isCall);
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
			this.firstRob = id;
			this.isRobFag = true;
		}
		player.setIsRob(isRob);
	},

	//某个玩家抢地主结束调用
	this.aPlayerRobOver = function(id){
		// var _this = this;
		// var player = PlayerMgr.GetPlayer(id).nextPlayer();
		// //如果叫过地主并且没有玩家抢地主，则指定为地主
		// if(player.isCall() && !this.isHasPlayerRob()){
		// 	setTimeout(function(){
		// 		_this.setLandlord(player.getID());
		// 	},1000);
		// 	return;
		// }
		// if(!player.isAI()){
		// 	Game_Notify_Center.Publish(ObserverType.OT_START_ROB_LANDLORD);
		// }else{
		// 	if(!player.isRob()){
		// 		this.calcIsRobLandlord(player.getID());
		// 	}
		// }
	},

	//获取3张底牌
	this.getBottomCard = function(landlordID){
		var cards = this._cardMgr.getBottomCard();
		return cards;
	},

	this.initEvent = function(){
		var _this = this;
		//开始游戏
		Game_Event_Center.RegisterEvent(EventType.ET_START_GAME,function(){
			_this.startGame();
		});
		//发牌
		Game_Event_Center.RegisterEvent(EventType.ET_DEAL,function(){
			_this.deal();
		});
		//发牌结束
		Game_Event_Center.RegisterEvent(EventType.ET_DEAL_OVER,function(params){
			_this.startCallCard();
		});
		//叫地主
		Game_Event_Center.RegisterEvent(EventType.ET_CALL_OR_NOT_LANDLORD,function(params){
			_this.callLandlord(params.player_id,params.is_call);
		});
		// //某个玩家抢地主结束
		// Game_Event_Center.RegisterEvent(EventType.ET_PLAYER_ROB_OVER,function(params){
		// 	_this.aPlayerRobOver(params.player_id);
		// });
		//抢地主
		Game_Event_Center.RegisterEvent(EventType.ET_ROB_LANDLORD,function(params){
			_this.robLandlord(params.player_id,params.is_rob);
		});
	}

};

var Game_Rules = new GameRules();
Game_Rules.Init();