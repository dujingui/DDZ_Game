
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
		this._mainPlayer 	= new Player(res.Player_png);
		this._leftPlayer 	= new Player(res.Player_png);
		this._rightPlayer 	= new Player(res.Player_png);

        var size = cc.winSize;

		this._mainPlayer.setPosition(size.width * 0.08,size.height * 0.14);
		this._leftPlayer.setPosition(size.width * 0.03,size.height * 0.61);
		this._rightPlayer.setPosition(size.width * 0.94,size.height * 0.61);

		this.addChild(this._mainPlayer);
		this.addChild(this._leftPlayer);
		this.addChild(this._rightPlayer);
	},	

	//发牌
	_deal : function(){
		var _this = this;

		this._cardMgr.createCards();
		this._cardMgr.shuffle();

		var index = 0;

		for(var i = 0; i < CardDef.CardNum - 3; i += 3){
			var cardid = _this._cardMgr.getSoleIDByIndex(i);
			_this._mainPlayer.deal(cardid);
			var cardid = _this._cardMgr.getSoleIDByIndex(i + 1);
			_this._leftPlayer.deal(cardid);
			var cardid = _this._cardMgr.getSoleIDByIndex(i + 2);
			_this._rightPlayer.deal(cardid);
		}

		this._cardMgr.sort(this._mainPlayer.getCardList());
		this._cardMgr.sort(this._leftPlayer.getCardList());
		this._cardMgr.sort(this._rightPlayer.getCardList());

		var dealSchedule = function(){
			if(index >= 17){
				_this.unschedule(dealSchedule);
				return;
			}
			var cardid = _this._mainPlayer.getCardSoleID(index ++);
			_this._updateCardUI(cardid);
		};
		_this.schedule(dealSchedule,0.05);
	},


	_updateCardUI : function(id){
		var sp  = this._createCardUI(id);
		sp.setPosition(200 + this.tempTest * 40,100);
		this.addChild(sp);

		this.tempTest ++;
	},

	_createCardUI : function(id){
		// console.log(id);

		var card = this._cardMgr.getCardData(id);
		var cardui = new CardUI(card);

		return cardui;
	},

	_initBg : function(){
		var bg = new cc.Sprite(res.Bg_png);
		bg.setAnchorPoint(0,0);
		this.addChild(bg,-1);
	}
});