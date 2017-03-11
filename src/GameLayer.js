
var GameLayer = cc.Layer.extend({

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

		this._cardUIList = [];
		this._initBg();
		this._initPlayerUI();
		this._initEvent();

		this._start();
	},

	_start : function(){
		Game_Event_Center.DispatchEvent(EventType.ET_START_GAME);
		Game_Event_Center.DispatchEvent(EventType.ET_DEAL);
		this._deal();
	},

	_initEvent : function(){
		var _this = this;

		//开始叫地主
		Game_Notify_Center.Subscribe(ObserverType.OT_START_CALL_CARD,function(params){
			_this._startCallCard(params.player_id);
		});
		Game_Notify_Center.Subscribe(ObserverType.OT_AI_WAIT,function(params){
			_this._aiWait(params.player_id);
		});
		//开始抢地主
		Game_Notify_Center.Subscribe(ObserverType.OT_START_ROB_LANDLORD,function(params){
			_this._startRobLandlord(params.player_id);
		});
		//抢地主
		Game_Notify_Center.Subscribe(ObserverType.OT_ROB_LANDLORD,function(params){
			_this._robLandlord(params.player_id,params.is_rob,params.cards);
		});
		//叫地主
		Game_Notify_Center.Subscribe(ObserverType.OT_CALL_LANDLORD,function(params){
			_this._callLandlord(params.player_id,params.is_call);
		})
		//成为地主
		Game_Notify_Center.Subscribe(ObserverType.OT_BECOME_LANDLORD,function(params){
			_this._becomeLandlord(params);
		});
	},

	_initPlayerUI : function(){
		this._mainPlayer 	= PlayerMgr.CreatePlayer(res.Player_png,false);
		this._rightPlayer 	= PlayerMgr.CreatePlayer(res.Player_png,true);
		this._leftPlayer 	= PlayerMgr.CreatePlayer(res.Player_png,true);

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
				//发牌结束
				_this.unschedule(dealSchedule);
				Game_Event_Center.DispatchEvent(EventType.ET_DEAL_OVER);
				return;
			}
			var cardid = _this._mainPlayer.getCardSoleID(index ++);
			_this._updateCardUI(cardid,index);
		};
		_this.schedule(dealSchedule,0.05);
	},

	//显示ai等待UI
	_aiWait : function(id){

		Game_UI_Mgr.ShowUI(Game_UI_Type.GUT_AI_Wait,{player_id:id});
	},

	//开始叫牌
	_startCallCard : function(playerid){
		var _this = this;
        var size = cc.winSize;

        var player = PlayerMgr.GetPlayer(playerid);
        Game_UI_Mgr.RemoveTempUI(playerid);
        
        if(player.isAI()){
        	this._aiWait(playerid)
        }else{
    		Game_UI_Mgr.ShowUI(Game_UI_Type.GUT_Self_CallCard);
        }
	},

	//开始抢地主
	_startRobLandlord : function(playerid){
		var player = PlayerMgr.GetPlayer(playerid);
		Game_UI_Mgr.RemoveTempUI(playerid);
		if(player.isAI()){
			Game_UI_Mgr.ShowUI(Game_UI_Type.GUT_AI_Wait,{player_id:playerid});
		}else{
			Game_UI_Mgr.ShowUI(Game_UI_Type.GUT_Self_Rob_Landlord);
		}
	},

	//抢地主
	_robLandlord : function(id,isRob){
		var player = PlayerMgr.GetPlayer(id);

		Game_UI_Mgr.RemoveTempUI(id);
		Game_UI_Mgr.ShowUI(Game_UI_Type.GUT_ROB_RESULT_LABEL,{player_id:id,is_rob:isRob});
		// Game_Event_Center.DispatchEvent(EventType.ET_PLAYER_ROB_OVER,{player_id:id});
	},

	//叫地主
	_callLandlord : function(id,iscall){
		var player = PlayerMgr.GetPlayer(id);

		Game_UI_Mgr.RemoveTempUI(id);
		Game_UI_Mgr.ShowUI(Game_UI_Type.GUT_CALL_RESULT_LABEL,{player_id:id,is_call:iscall});
	},

	//成为地主
	_becomeLandlord : function(params){
		var playerid = params.player_id;
		var bottomCards = params.cards;
		var player = PlayerMgr.GetPlayer(playerid);
		if(player.isAI()){
			this._dealBottomCard(playerid,bottomCards);
		}else{
			this._dealBottomCard(playerid,bottomCards);
			Game_UI_Mgr.RemoveAllTempUI();
		}
		var flipped = player.isFlippedX();
		player.initWithFile(res.landlord_png);
		player.setFlippedX(flipped);
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

		var card = Game_Rules.GetCardData(id);
		var cardui = new CardUI(card);

		this._cardUIList.push(cardui);

		return cardui;
	},

	_setCardUIOrder : function(){
		var cardList = this._mainPlayer.getCardList();
		var cardMgr = Game_Rules.GetCardMgr();
		for(var i = 0;i < this._cardUIList.length;i++){
			var cardUI = this._cardUIList[i];
			var order = cardMgr.getCardIndex(cardList,cardUI.getID());
			cardUI.setLocalZOrder(order);
		}
	},

	_dealBottomCard : function(id,cards){
		var _this = this;
		var player = PlayerMgr.GetPlayer(id);

		var cardMgr = Game_Rules.GetCardMgr();

		var offset = 40;
		var node = new cc.Node();
		node.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.5);
		this.addChild(node);
		node.setVisible(false);
		for(var i = 0;i < cards.length;i ++){
			var cardid = cards[i];
			var cardData = cardMgr.getCardData(cardid);
			var cardui = new CardUI(cardData,true);
			cardui.setPosition(i*offset,0);
			node.addChild(cardui);
		}

		var showBottomCard = function(){
			node.setScale(0);
			node.setPosition(cc.winSize.width * 0.5,cc.winSize.height - 50);
			node.runAction(cc.sequence(cc.scaleTo(0.1,1)));
		}

		if(player.isAI()){
			node.setVisible(true);
			var pos = null;
			if(id == 2){
				pos = this._rightCardUI.getPosition();
			}else{
				pos = this._leftCardUI.getPosition();
			}
			node.runAction(cc.sequence(cc.spawn(cc.moveTo(1,pos),cc.scaleTo(1,0)),cc.callFunc(function(){
				if(id == 2){
					_this._rightCardNum.setString(20);
				}else{
					_this._leftCardNum.setString(20);
				}
				showBottomCard();
			})));
			return;
		}

		var cardList = this._mainPlayer.getCardList();

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

			cardUI.runAction(cc.sequence(cc.delayTime(0.7),cc.moveBy(0.4,0,-100),cc.callFunc(function(){
				showBottomCard();
				node.setVisible(true);
			})));
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