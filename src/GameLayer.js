
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
		EventCenter.RegisterEvent(EventType.ET_CALL_CARD,function(){
			_this._callCard();
		});
		EventCenter.RegisterEvent(EventType.ET_ROB_LANDLORD,function(other){
			_this._robLandlord(other.id,other.isRob);
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

	//叫牌
	_callCard : function(){
		var _this = this;
        var size = cc.winSize;

		var callBtn = new ccui.Button(res.normal_btn,res.press_btn);
		var noCallBtn = new ccui.Button(res.normal_btn,res.press_btn);
		callBtn.setScale(0.6);
		noCallBtn.setScale(0.6);
		callBtn.setPosition(size.width * 0.4,size.height * 0.35);
		noCallBtn.setPosition(size.width * 0.6,size.height * 0.35);
		this.addChild(callBtn);
		this.addChild(noCallBtn);


		var def = this._getLabelDef();

		var callLabel1 = new cc.LabelTTF("叫地主",def);
		var callLabel2 = new cc.LabelTTF("不叫",def);
		callLabel1.setAnchorPoint(0.5,0.5);
		callLabel2.setAnchorPoint(0.5,0.5);
		var btnsize = callBtn.getContentSize();
		callLabel1.setPosition(btnsize.width * 0.5,btnsize.height * 0.5);
		callLabel2.setPosition(btnsize.width * 0.5,btnsize.height * 0.5);

		noCallBtn.addChild(callLabel2);
		callBtn.addChild(callLabel1);

		var updateUI = function(isCall){
			var text = '叫地主';
			if(!isCall){
				text = "不叫";
			}
			var tag = "call_ui";
			var def = _this._getLabel2Def();
			var label = new cc.LabelTTF(text,def);
			label.setAnchorPoint(0.5,0.5);
			label.setTag(tag);
			label.setPosition(size.width * 0.5,size.height * 0.35);
			_this.addChild(label);
			callBtn.removeFromParent();
			noCallBtn.removeFromParent();
			_this._mainPlayer.setTempUI(tag);
		};

		callBtn.addTouchEventListener(function(){
			updateUI(true);
			_this._mainPlayer.setIsCall(true);
			_this._mainPlayer.nextPlayer().robLandlord();
		});
		noCallBtn.addTouchEventListener(function(){
			updateUI(false);
			_this._mainPlayer.setIsCall(false);
			_this._mainPlayer.nextPlayer().robLandlord();
		});
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

	_getLabelDef : function(){
		var def = new cc.FontDefinition(); // 声明文字定义
		def.fontName = "楷体"; // 字体
		def.fontSize = 40; // 字号大小
		def.textAlign = cc.TEXT_ALIGNMENT_CENTER; // 文字对齐
		def.fillStyle = cc.color(100,100,100,0); // 字体(内部)颜色
		def.strokeEnabled = true; // 开启文字描边效果
		def.strokeStyle = cc.color("#000000"); // 描边的颜色
		def.lineWidth = 1; // 字体的宽度
		def.shadowOffsetX = 4; // 阴影X轴效果
		def.shadowOffsetY = 4; // 阴影Y轴效果

		return def;
	},

	_getLabel2Def : function(){
		var def = new cc.FontDefinition(); // 声明文字定义
		def.fontName = "楷体"; // 字体
		def.fontSize = 50; // 字号大小
		def.textAlign = cc.TEXT_ALIGNMENT_CENTER; // 文字对齐
		def.fillStyle = cc.color(255,255,0); // 字体(内部)颜色
		def.strokeEnabled = true; // 开启文字描边效果
		def.strokeStyle = cc.color(145,72,0); // 描边的颜色
		def.lineWidth = 3; // 字体的宽度
		def.shadowOffsetX = 4; // 阴影X轴效果
		def.shadowOffsetY = 4; // 阴影Y轴效果

		return def;
	},

	_showRobLandlordUI : function(){

	},

	_robLandlord : function(id,isRob){
		var size = cc.winSize;
		var _this = this;

		if(PlayerMgr.IsAI(id)){
			var text = '抢地主';
			if(!isRob){
				text = "不抢";
			}
			var tag = "rob_ui";
			var def = this._getLabel2Def();
			var label = new cc.LabelTTF(text,def);
			label.setAnchorPoint(0.5,0.5);
			label.setTag(tag);
			PlayerMgr.GetPlayer(id).setTempUI(tag);
			this.addChild(label);
			if(id == 2){
				label.setPosition(size.width * 0.8,size.height * 0.6);
			}else if(id == 3){
				label.setPosition(size.width * 0.2,size.height * 0.6);
			}
			PlayerMgr.GetPlayer(id).nextPlayer().robLandlord();
		}else{
			var tag = PlayerMgr.GetPlayer(id).getTempUI();
			if(tag){
				this.removeChildByTag(tag);
			}
			var robBtn = new ccui.Button(res.normal_btn,res.press_btn);
			var noRobBtn = new ccui.Button(res.normal_btn,res.press_btn);
			robBtn.setScale(0.6);
			noRobBtn.setScale(0.6);
			robBtn.setPosition(size.width * 0.4,size.height * 0.35);
			noRobBtn.setPosition(size.width * 0.6,size.height * 0.35);
			this.addChild(robBtn);
			this.addChild(noRobBtn);

			var def = this._getLabelDef();

			var updateUI = function(){
				robBtn.removeFromParent();
				noRobBtn.removeFromParent();
			};

			robBtn.addTouchEventListener(function(){
				updateUI();
				PlayerMgr.GetPlayer(id).setLandlord();
				var cards = _this._gameRules.GetBottomCard();
				_this._dealBottomCard(cards);
			});

			noRobBtn.addTouchEventListener(function(){
				updateUI();
			});

			var callLabel1 = new cc.LabelTTF("抢地主",def);
			var callLabel2 = new cc.LabelTTF("不抢",def);
			callLabel1.setAnchorPoint(0.5,0.5);
			callLabel2.setAnchorPoint(0.5,0.5);
			var btnsize = robBtn.getContentSize();
			callLabel1.setPosition(btnsize.width * 0.5,btnsize.height * 0.5);
			callLabel2.setPosition(btnsize.width * 0.5,btnsize.height * 0.5);

			noRobBtn.addChild(callLabel2);
			robBtn.addChild(callLabel1);
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