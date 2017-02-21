
var GameLayer = cc.Layer.extend({

	_cardMgr 	: null,

	tempTest	: 1,

	_mainPlayer	: null,
	_leftPlayer	: null,
	_rightPlayer: null,

	ctor : function(){
		this._super();

		this._cardMgr = new CardManager();

		this._initBg();
		this._initPlayerUI();
		this._deal();
	},

	_initPlayerUI : function(){
		_mainPlayer 	= new Player(res.Player_png);
		_leftPlayer 	= new Player(res.Player_png);
		_rightPlayer 	= new Player(res.Player_png);

        var size = cc.winSize;

		_mainPlayer.setPosition(size.width * 0.08,size.height * 0.14);
		_leftPlayer.setPosition(size.width * 0.03,size.height * 0.61);
		_rightPlayer.setPosition(size.width * 0.94,size.height * 0.61);

		this.addChild(_mainPlayer);
		this.addChild(_leftPlayer);
		this.addChild(_rightPlayer);
	},	

	//发牌
	_deal : function(){
		var _this = this;

		var cards = this._cardMgr.createCards();
		this._cardMgr.shuffle(cards);
		var index = 0;
		var count = 0;
		var dealSchedule = function(){
			if(count >= 17){
				_this.unschedule(dealSchedule);
				return;
			}
			var cardid = _this._cardMgr.getSoleIDByIndex(index ++);
			_mainPlayer.deal(cardid);
			_this._updateCardUI(cardid);
			cardid = _this._cardMgr.getSoleIDByIndex(index ++);
			_mainPlayer.deal(cardid);
			cardid = _this._cardMgr.getSoleIDByIndex(index ++);
			_mainPlayer.deal(cardid);
			count ++;
		};
		this.schedule(dealSchedule,0.3);
	},


	_updateCardUI : function(id){
		var sp  = this._createCardUI(id);
		sp.setPosition(100 + this.tempTest * 30,100);
		sp.setAnchorPoint(0,0);
		this.addChild(sp);

		this.tempTest ++;
	},

	_createCardUI : function(id){
		console.log(id);

		var card = this._cardMgr.getCardData(id);
		var cardRect = CardUtil.getCardRect(card.color,card.numID)
		var cardFileName = CardUtil.getCardFileName(card.color);
		var sp = new cc.Sprite(cardFileName,cardRect);

		var colorUIRect = CardUtil.getCardColorRect(card.color);
		var colorUIFileName = CardUtil.getCardColorFileName();
		var colorSp = new cc.Sprite(colorUIFileName,colorUIRect);
		colorSp.setAnchorPoint(0,0);
		colorSp.setPosition(3,-cardRect.height * 0.7);

		sp.addChild(colorSp);

		return sp;
	},

	_initBg : function(){
		var bg = new cc.Sprite(res.Bg_png);
		bg.setAnchorPoint(0,0);
		this.addChild(bg,-1);
	}
});