
var Player = cc.Sprite.extend({

	_cardList 	: null,
	_isAI 		: null,
	_isCall		: null,	//是否叫了地主
	_id			: null,
	_isSplit	: null,//拆牌标记
	_isRob		: null, //是否抢了地主
	_isLandlord	: null, //是否是地主
	_curCardNum	: null,	//当前牌的数量

	_cardTypeGroups : null,	//牌型组

	_tempUI 	: null,

	_test		:null,	//测试用

	ctor : function(fileName,isAI){
		this._super(fileName);

		this._isAI = isAI;
		this._cardTypeGroups = new CardTypeGroup();

		this.init();
	},

	init : function(){
		this._cardList = [];
	},

	getCurCardNum : function(){
		return this._curCardNum;
	},

	setIsSplit : function(isSplit){
		this._isSplit =isSplit;
	},

	isSplit : function(){
		return this._isSplit;
	},

	setID : function(id){
		this._id = id;
	},

	getID : function(){
		return this._id;
	},

	getCardTypeGroup : function(){
		return this._cardTypeGroups;
	},

	setIsAI : function(isAI){
		this._isAI = isAI;
	},

	isAI : function(){
		return this._isAI;
	},

	getCardList : function(){
		return this._cardList;
	},

	//出牌
	discard : function(cards){
		this._curCardNum -= cards.length;
		// for(var i = 0; i< cards.length; i++){
		// 	for(var j = 0; j < this._cardList.length; j++){
		// 		if(cards[i] === this._cardList[j]){
		// 			this._cardList.splice(j, 1);
		// 			break;
		// 		}
		// 	}
		// }
	},

	//判断某张牌是不是自己的
	isBelongSelf : function(soleid){
		return CardUtil.isContainBySoleID(this._cardList,soleid);
	},

	getCardSoleID : function(index){
		return this._cardList[index];
	},

	setIsCall : function(iscall){
		this._isCall = iscall;
	},

	isCall : function(){
		return this._isCall;
	},

	setIsRob : function(isrob){
		this._isRob = isrob;
	},

	isRob : function(){
		return this._isRob;
	},

	callCard : function(){
		// if(!this.isAI()){
		// 	EventCenter.PublishEvent(EventType.ET_CALL_CARD);
		// }
	},

	robLandlord : function(){
		EventCenter.PublishEvent(EventType.ET_ROB_LANDLORD,{id:this._id,isRob:false});
	},

	setTempUI : function(tag){
		this._tempUI = tag;
	},

	getTempUI : function(){
		return this._tempUI;
	},

	setLandlord : function(){
		this._isLandlord = true;
	},

	addBottomCards : function(cards){
		this._cardList = CardUtil.mergeArray(this._cardList, cards);
		Game_Card_Mgr.sort(this._cardList);

		this._curCardNum += cards.length;
	},

	isLandlord : function(){
		return this._isLandlord;
	},

	next : function(){
		var id;

		if(this._id >= 3){
			id = 1;
		}else{
			id = this._id + 1;
		}
		return id;
	},

	nextPlayer : function(){
		var id = this.next();
		return PlayerMgr.GetPlayer(id);
	},

	deal : function(id){
		// if(!this.test){
		// 	this.test = 1;
		// }
		// this._cardList.push(this.test++);

		if(id >= 1 && id <= 54){
			this._cardList.push(id);
			++ this._curCardNum;
		}
	}
});
