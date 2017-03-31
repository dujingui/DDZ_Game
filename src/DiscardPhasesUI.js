//自己出牌阶段UI

var DiscardPhasesUI = BasicUI.extend({

	_notDiscardBtn 	: null,	//不出牌按钮
	_hintBtn 		: null,		//提示按钮
	_discardBtn 	: null,		//出牌按钮

	ctor : function(){
		this._super();
		this.setName("DiscardPhasesUI");
		this._registerObserver();
	},

	_registerObserver : function(){
		var _this = this;
		//可以出牌
		Game_Notify_Center.Subscribe(ObserverType.OT_CAN_DISCARD,function(){
			_this._canDiscard();
		});

		//不可以出牌
		Game_Notify_Center.Subscribe(ObserverType.OT_NOT_CAN_DISCARD,function(){
			_this._notCanDiscard();
		});
	},

	_initUI : function(){
		var _this = this;

		var def = this.getLabelDef();
		var size = cc.winSize;
		var parent = this;

		var notBtn = new ccui.Button(res.normal_btn,res.press_btn,res.disabled_btn);
		var hintBtn = new ccui.Button(res.normal_btn,res.press_btn,res.disabled_btn);
		var discardBtn = new ccui.Button(res.normal_btn,res.press_btn,res.disabled_btn);

		var notLabel = new cc.LabelTTF("不出",def);
		var hintLabel = new cc.LabelTTF("提示",def);
		var discardLabel = new cc.LabelTTF("出牌",def);

		var btnsize = notBtn.getContentSize();
		notLabel.setAnchorPoint(0.5,0.5);
		hintLabel.setAnchorPoint(0.5,0.5);
		discardLabel.setAnchorPoint(0.5,0.5);
		notLabel.setPosition(btnsize.width * 0.5,btnsize.height * 0.5);
		hintLabel.setPosition(btnsize.width * 0.5,btnsize.height * 0.5);
		discardLabel.setPosition(btnsize.width * 0.5,btnsize.height * 0.5);
		notBtn.addChild(notLabel);
		hintBtn.addChild(hintLabel);
		discardBtn.addChild(discardLabel);
		notBtn.setPosition(size.width * 0.3, size.height * 0.4);
		hintBtn.setPosition(size.width * 0.5, size.height * 0.4);
		discardBtn.setPosition(size.width * 0.7, size.height * 0.4);
		parent.addChild(notBtn);
		parent.addChild(hintBtn);
		parent.addChild(discardBtn);

		notBtn.addTouchEventListener(this._btnCallback,this);
		hintBtn.addTouchEventListener(this._btnCallback,this);
		discardBtn.addTouchEventListener(this._btnCallback,this);

		this._notDiscardBtn = notBtn;
		this._hintBtn = hintBtn;
		this._discardBtn = discardBtn;

		var state = Game_Rules.GetState();
		if(state === Game.GameState.GS_FollowCard){
			this._notCanDiscard();
		}
	},

	_canDiscard : function(){
		this._discardBtn.setBright(true); 
		this._discardBtn.setTouchEnabled(true);
	},

	_notCanDiscard : function(){
		this._discardBtn.setBright(false); 
		this._discardBtn.setTouchEnabled(false);
	},

	_btnCallback : function(sender, type){
		if(type == ccui.Widget.TOUCH_ENDED){
			this.removeFromParent();
			if(sender == this._notDiscardBtn){
				Game_Event_Center.DispatchEvent(EventType.ET_CLICK_NOT_DISCARD);
			}else if(sender == this._discardBtn){
				Game_Event_Center.DispatchEvent(EventType.ET_CLICK_DISCARD_BTN);
			}
		}
	}
});