
var GameLayer = cc.Layer.extend({

	_gameRules	: null,

	tempTest	: 1,

	_mainPlayer	: null,
	_leftPlayer	: null,
	_rightPlayer: null,

	_leftCardUI	: null,
	_rightCardUI: null,

	_leftCardNum: null,
	_rightCardNum:null,

	_cardUIList : null,

	ctor : function(){
		this._super();

		this._gameRules = new GameRules();
		this._cardUIList = [];
		this._initBg();
		this._initPlayerUI();
		this._initEvent();

		this._start();
	},

	_start : function(){
		this._gameRules.StartGame();
	},

	_initEvent : function(){
		var _this = this;

		EventCenter.RegisterEvent(EventType.ET_DEAL,function(){
			_this._deal();
		});
		EventCenter.RegisterEvent(EventType.ET_START_CALL_CARD,function(other){
			_this._startCallCard(other.player_id);
		});
		EventCenter.RegisterEvent(EventType.ET_ROB_LANDLORD,function(other){
			_this._robLandlord(other.id,other.is_rob);
		});
		EventCenter.RegisterEvent(EventType.ET_CALL_CARD,function(other){
			_this._callCard(other.id,other.is_call);
		});
		EventCenter.RegisterEvent(EventType.ET_ROB_START_LANDLORD,function(other){
			_this._startRobLandlord(other.id);
		});
	},

	_initPlayerUI : function(){
		this._mainPlayer 	= PlayerMgr.CreatePlayer(res.Player_png,false);
		this._leftPlayer 	= PlayerMgr.CreatePlayer(res.Player_png,true);
		this._rightPlayer 	= PlayerMgr.CreatePlayer(res.Player_png,true);

        var size = cc.winSize;

		this._mainPlayer.setPosition(size.width * 0.08,size.height * 0.14);
		this._leftPlayer.setPosition(size.width * 0.03,size.height * 0.61);
		this._rightPlayer.setPosition(size.width * 0.97,size.height * 0.61);

		this._rightPlayer.setFlippedX(true);

		this.addChild(this._mainPlayer);
		this.addChild(this._leftPlayer);
		this.addChild(this._rightPlayer);
	},	

	//发牌
	_deal : function(){
		var _this = this;

		var index = 0;

		var dealSchedule = function(){
			if(index >= 17){
				_this.unschedule(dealSchedule);
				_this._gameRules.NextStep();
				return;
			}
			var cardid = _this._mainPlayer.getCardSoleID(index ++);
			_this._updateCardUI(cardid,index);
		};
		_this.schedule(dealSchedule,0.05);
	},

	//开始叫牌
	_startCallCard : function(playerid){
		var _this = this;
        var size = cc.winSize;

        var player = PlayerMgr.GetPlayer(playerid);

        if(player.isAI()){
    		Game_UI_Mgr.ShowUI(Game_UI_Type.GUI_AI_Wait,this);
        }else{
        	Game_UI_Mgr.ShowUI(Game_UI_Type.GUT_Self_CallCard,this);
        }
	},

	_callCard : function(id,iscall){
		// EventCenter.PublishEvent(EventType.ET_REMOVE_WAIT_UI);

		var player = PlayerMgr.GetPlayer(id);
		player.setIsCall(iscall);
		this._gameRules.CalcIsRobLandlord(player.next());

		Game_UI_Mgr.ShowUI(Game_UI_Type.GUT_CALL_RESULT_LABEL,{id:id,is_call:iscall});
		Game_UI_Mgr.ShowUI(Game_UI_Type.GUT_AI_Wait,{id:player.next()});

		// _this._mainPlayer.setIsCall(iscall);
		// _this._mainPlayer.nextPlayer().robLandlord();
	},

	_updateCardUI : function(id,index){
		var sp  = this._createCardUI(id);
		sp.setPosition(200 + this.tempTest * 40,100);
		this.addChild(sp);

        var size = cc.winSize;

		if(!this._leftCardUI){
			this._leftCardUI = new cc.Sprite(res.card_chu);
			this.addChild(this._leftCardUI);
			this._leftCardUI.setPosition(size.width * 0.2,size.height * 0.5);
			var cardsize = this._leftCardUI.getContentSize();

			this._leftCardNum = new cc.LabelAtlas("",res.num4,40,42,"0");
			this._leftCardNum.setAnchorPoint(0.5,0.5);
			this._leftCardNum.setScale(0.6);
			this._leftCardNum.setPosition(cardsize.width * 0.5,cardsize.height * 0.5);
			this._leftCardUI.addChild(this._leftCardNum);
		}
		if(!this._rightCardUI){
			this._rightCardUI = new cc.Sprite(res.card_chu);
			this.addChild(this._rightCardUI);
			this._rightCardUI.setFlippedX(true);
			this._rightCardUI.setPosition(size.width * 0.8,size.height * 0.5);
			var cardsize = this._rightCardUI.getContentSize();

			this._rightCardNum = new cc.LabelAtlas("",res.num4,40,42,"0");
			this._rightCardNum.setAnchorPoint(0.5,0.5);
			this._rightCardNum.setScale(0.6);
			this._rightCardNum.setPosition(cardsize.width * 0.5,cardsize.height * 0.5);
			this._rightCardUI.addChild(this._rightCardNum);
		}

		this._leftCardNum.setString(index);
		this._rightCardNum.setString(index);

		this.tempTest ++;
	},

	_createCardUI : function(id){
		// console.log(id);

		var card = this._gameRules.GetCardData(id);
		var cardui = new CardUI(card);

		this._cardUIList.push(cardui);

		return cardui;
	},

	_showRobLandlordUI : function(){

	},

	_startRobLandlord : function(){
		Game_UI_Mgr.RemoveTempUI(1);
		Game_UI_Mgr.ShowUI(Game_UI_Type.GUT_Self_Rob_Landlord);
	},

	_robLandlord : function(id,isRob){
		var player = PlayerMgr.GetPlayer(id);

		if(isRob && player.isCall()){
			player.setLandlord(true);
			var cards = this._gameRules.GetBottomCard();
			this._dealBottomCard(cards);
			Game_UI_Mgr.RemoveAllTempUI();
			return;
		}

		Game_UI_Mgr.ShowUI(Game_UI_Type.GUT_ROB_RESULT_LABEL,{id:id,is_rob:isRob});
		EventCenter.PublishEvent(EventType.ET_REMOVE_WAIT_UI);
		this._gameRules.CalcIsRobLandlord(player.next());
		if(player.nextPlayer().isAI()){
			Game_UI_Mgr.ShowUI(Game_UI_Type.GUT_AI_Wait,{id:player.next()});
		}
	},

	_setCardUIOrder : function(){
		var cardList = this._mainPlayer.getCardList();
		var cardMgr = this._gameRules.GetCardMgr();
		for(var i = 0;i < this._cardUIList.length;i++){
			var cardUI = this._cardUIList[i];
			var order = cardMgr.getCardIndex(cardList,cardUI.getID());
			cardUI.setLocalZOrder(order);
		}
	},

	_dealBottomCard : function(cards){
		var cardList = this._mainPlayer.getCardList();
		var cardMgr = this._gameRules.GetCardMgr();

		for(var i = 0;i < cards.length;i ++){
			var cardData = cardMgr.getCardData(cards[i]);
			var cardUI = new CardUI(cardData);
			cardMgr.insert(cardList,cardData.soleID);
			var index = cardMgr.getCardIndex(cardList,cardUI.getID());
			this._moveCard(index);
			if(!this._cardUIList[index]){
				var a = 0;
			}
			var cardUI_x = 0;
			if(index <= 0){
				cardUI_x = this._cardUIList[index].getPositionX() - 40;
			}else{
				cardUI_x = this._cardUIList[index - 1].getPositionX() + 40;
			}
			cardUI.setPosition(cardUI_x,200);
			cardUI.setLocalZOrder(index);
			this.addChild(cardUI);
			this._cardUIList.splice(index,0,cardUI);

			cardUI.runAction(cc.sequence(cc.delayTime(0.7),cc.moveBy(0.4,0,-100)));
		}

		this._setCardUIOrder();
	},

	_moveCard : function(index){
		for(var i = 0;i < index;i ++){
			var cardUI = this._cardUIList[i];
			cardUI.setPositionX(cardUI.getPositionX() - 40);
		}
	},

	_initBg : function(){
		var bg = new cc.Sprite(res.Bg_png);
		bg.setAnchorPoint(0,0);
		this.addChild(bg,-1);
	}
});