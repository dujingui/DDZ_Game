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

	//发牌
	this.deal = function(){
		var tempPlayer = null;
		var cardid = null;
		var playerIndex = 0;

		this._cardMgr.createCards();
		this._cardMgr.shuffle();

		for(var i = 0;i < this.CardNum - 3;i ++){
			if(playerIndex >= 3){
				playerIndex = 0;
			}
			cardid = this._cardMgr.getSoleIDByIndex(i);
			tempPlayer = PlayerMgr.GetPlayerByIndex(playerIndex ++);
			tempPlayer.deal(cardid);
		}

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

	//开始游戏
	this.startGame = function(){
	},

	//叫地主
	this.callLandlord = function(params){
		var playerID = params.player_id;
		var player = PlayerMgr.GetPlayer(playerID);
		player.setIsCall(true);
		this.calcIsRobLandlord(player.next());
	},

	//抢地主
	this.robLandlord = function(id,isRob){
		var player = PlayerMgr.GetPlayer(id);
		if(isRob){
			player.setLandlord(true);
		}
		var cards = this.getBottomCard();
		Game_Notify_Center.Publish(ObserverType.OT_ROB_LANDLORD,{player_id:id,is_rob:isRob,cards:cards});
	},

	//计算是否叫牌
	this.calcIsCallCard = function(id){
		setTimeout(function(){
			EventCenter.PublishEvent(EventType.ET_CALL_CARD,{id:id,is_call:false});
		},3000);
	},

	//计算是否抢地主
	this.calcIsRobLandlord = function(id){
		var player = PlayerMgr.GetPlayer(id);
		var isRob = Util.GetRandomNum(0,1);
		if(player.isAI()){
			setTimeout(function(){
				Game_Notify_Center.Publish(ObserverType.OT_ROB_LANDLORD,{player_id:id,is_rob:isRob});
			},3000);
		}else{
			Game_Notify_Center.Publish(EventType.ET_ROB_START_LANDLORD,{player_id:id});
		}

		if(isRob && !this.isRobFag){
			this.firstRob = id;
			this.isRobFag = true;
		}
		player.setIsRob(isRob);
		Game_Notify_Center.Publish(ObserverType.OT_AI_WAIT,{player_id:id});
	},

	//指定一名玩家开始叫牌
	this.callCard = function(){
		var callCardPlayerID = 1;
		var player = PlayerMgr.GetPlayer(callCardPlayerID);
		if(player.isAI()){
			this.calcIsCallCard(callCardPlayerID);
		}else{
			// Game_Notify_Center.Publish(ObserverType.OT_START_CALL_CARD)
		}
		Game_Notify_Center.Publish(ObserverType.OT_START_CALL_CARD,{player_id:callCardPlayerID});
	},

	//某个玩家抢地主结束调用
	this.aPlayerRobOver = function(id){
		var player = PlayerMgr.GetPlayer(id).nextPlayer();
		if(!player.isAI()){
			Game_Notify_Center.Publish(ObserverType.OT_START_ROB_LANDLORD);
		}else{
			if(!player.isRob()){
				this.calcIsRobLandlord(player.getID());
			}
		}
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
		Game_Event_Center.RegisterEvent(EventType.ET_DEAL,function(){
			_this.deal();
		});
		//发牌结束
		Game_Event_Center.RegisterEvent(EventType.ET_DEAL_OVER,function(params){
			_this.callCard();
		});
		//叫地主
		Game_Event_Center.RegisterEvent(EventType.ET_CALL_LANDLORD,function(params){
			_this.callLandlord(params);
		});
		//某个玩家抢地主结束
		Game_Event_Center.RegisterEvent(EventType.ET_PLAYER_ROB_OVER,function(params){
			_this.aPlayerRobOver(params.player_id);
		});
		//抢地主
		Game_Event_Center.RegisterEvent(EventType.ET_ROB_LANDLORD,function(params){
			_this.robLandlord(params.player_id,params.is_rob);
		});
	}

};

var Game_Rules = new GameRules();
Game_Rules.Init();