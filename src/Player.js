
var Player = cc.Sprite.extend({

	_cardList 	: null,
	_isAI 		: null,

	ctor : function(fileName){
		this._super(fileName);

		this.init();
	},

	init : function(){
		this._cardList = [];
	},

	setIsAI : function(isAI){
		this._isAI = isAI;
	},

	getCardList : function(){
		return this._cardList;
	},

	getCardSoleID : function(index){
		return this._cardList[index];
	},

	deal : function(id){
		if(id >= 1 && id <= 54){
			this._cardList.push(id);
		}
	}
});
