
var Player = cc.Sprite.extend({

	_cardList 	: null,
	_isAI 		: null,
	_isCall		: null,	//是否叫了地主
	_id			: null,
	_isRob		: null, //是否抢了地主
	_isLandlord	: null, //是否是地主

	_tempUI 	: null,

	ctor : function(fileName,isAI){
		this._super(fileName);

		this._isAI = isAI;

		this.init();
	},

	init : function(){
		this._cardList = [];
	},

	setID : function(id){
		this._id = id;
	},

	getID : function(){
		return this._id;
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
		if(id >= 1 && id <= 54){
			this._cardList.push(id);
		}
	}
});
