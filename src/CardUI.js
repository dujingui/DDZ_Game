
var CardUI = cc.Sprite.extend({

	_numSprite1 	: null,
	_numSprite2 	: null,
	_colorSprite1	: null,
	_colorSprite2 	: null,

	_id 			: null,

	_isSelected		: null,

	ctor : function(cardData){
		if(!cardData){
			var a= 0;
		}
		this._super(res.card_panel);

		this._init(cardData);

		this._initCardUI(cardData);
		this._initEvent();
	},

	getID : function(){
		return this._id;
	},

	_init : function(cardData){
		this.setTag(cardData.soleID);
		this._id = cardData.soleID;
		this._isSelected = false;
	},

	_setColor : function(value){
		this.setColor(cc.color(value,value,value));
		
		if(this._numSprite1){
			this._numSprite1.setColor(cc.color(value,value,value));
		}
		if(this._numSprite2){
			this._numSprite2.setColor(cc.color(value,value,value));
		}
		if(this._colorSprite1){
			this._colorSprite1.setColor(cc.color(value,value,value));
		}
		if(this._colorSprite2){
			this._colorSprite2.setColor(cc.color(value,value,value));
		}
	},

	_initCardUI : function(card){
		var size = this.getContentSize();

		var cardRect = CardUtil.getCardRect(card.color,card.numID)
		var cardFileName = CardUtil.getCardFileName(card.color);
		var sp = new cc.Sprite(cardFileName,cardRect);
		var sp1 = new cc.Sprite(cardFileName,cardRect);
		sp1.setRotation(180);
		sp1.setPosition(size.width - sp1.getContentSize().width / 2 - 3,sp1.getContentSize().height / 2 + 7);
		sp.setAnchorPoint(0,1);
		sp.setPosition(3,size.height - 7);
		this.addChild(sp);
		this.addChild(sp1);
		this._numSprite1 = sp;
		this._numSprite2 = sp1;

		var colorUIFileName = CardUtil.getCardColorFileName(card.color);
		if(colorUIFileName){
			var colorUIRect = CardUtil.getCardColorRect(card.color);
			var colorSp = new cc.Sprite(colorUIFileName,colorUIRect);
			var colorSp1 = new cc.Sprite(colorUIFileName,colorUIRect);
			colorSp1.setRotation(180);
			colorSp1.setPosition(size.width - colorSp1.getContentSize().width / 2 - 3,sp1.getContentSize().height + colorSp1.getContentSize().height / 2 + 7);
			colorSp.setAnchorPoint(0,1);
			colorSp.setPosition(5,sp.getPositionY() - sp.getContentSize().height);

			this._colorSprite1	= colorSp,
			this._colorSprite2 	= colorSp1,

			this.addChild(colorSp);
			this.addChild(colorSp1);
		}
	},

	_initEvent : function(){
		var _this = this;

		var listener = cc.EventListener.create({
			event : cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches : true,
			onTouchBegan : function(touch,event){
				var target = event.getCurrentTarget();
				var locationInNode = target.convertToNodeSpace(touch.getLocation());
				var s = target.getContentSize();
				var rect = cc.rect(0,0,s.width,s.height);
				if(cc.rectContainsPoint(rect,locationInNode)){
					console.log("点击牌");

					_this._setColor(50);

					return true;
				}
				return false;
			},
			onTouchMoved : function(touch,event){

			},
			onTouchEnded : function(touch,event){
				_this._setColor(255);
				if(_this._isSelected){
					_this._unselectCard();
				}else{
					_this._selectCard();
				}
			}
		});

		cc.eventManager.addListener(listener,this);
	},

	_selectCard : function(){
		this._isSelected = true;

		this.runAction(cc.moveBy(0.1,0,30));
		// this.setPositionY(this.getPositionY() + 30);
	},

	_unselectCard : function(){
		this._isSelected = false;

		this.runAction(cc.moveBy(0.1,0,-30));
		// this.setPositionY(this.getPositionY() - 30);
	}
});