/**
 * 游戏规则类
 */

function GameRules(){
	if(typeof this.instance == 'object'){
		return this.instance;
	}

	this.instance = this;

	this.Step = {
		Prepare : 0,	//准备中
		Deal 	: 1,	//发牌
		CallCard: 2,    //叫牌
	};


	this.CardNum = 54;

	this._cardMgr = new CardManager();
	this._curStep = this.Step.Prepare;

	// this.Init();

	this.Init = function(){
	},

	//开始游戏
	this.StartGame = function(){
		this.NextStep();
	},

	//下一步
	this.NextStep = function(){
		switch(this._curStep){
			case this.Step.Prepare:
			{
				this.Deal();
				break;
			}
			case this.Step.Deal:
			{
				this.CallCard();
				break;
			}
			default:break;
		}
		
	},

	//发牌
	this.Deal = function(){
		var tempPlayer = null;
		var cardid = null;
		var playerIndex = 0;

		this._curStep = this.Step.Deal;

		this._cardMgr.createCards();
		this._cardMgr.shuffle();

		for(var i = 0;i < this.CardNum - 3;i ++){
			if(playerIndex >= 3){
				playerIndex = 0;
			}
			cardid = this._cardMgr.getSoleIDByIndex(i);
			tempPlayer = PlayerMgr.GetPlayerByIndex(playerIndex ++);
			tempPlayer.deal(cardid);
		}

		for(var i = 0;i < 3;i ++){
			tempPlayer = PlayerMgr.GetPlayerByIndex(i);
			this._cardMgr.sort(tempPlayer.getCardList());
		}

		EventCenter.PublishEvent(EventType.ET_DEAL);
	},

	//给地主发底牌
	this.GetBottomCard = function(landlordID){
		// var player = PlayerMgr.GetPlayer(landlordID);
		// var curCards = player.getCardList();
		var cards = this._cardMgr.getBottomCard();
		// for(var i = 0;i < 3;i ++ ){
		// 	this._cardMgr.insert(curCards,cards[i]);
		// }
		// return cards;
		return cards;
	},

	//指定一名玩家叫牌
	this.CallCard = function(){
		this._curStep = this.Step.CallCard;
		var callCardPlayerID = 1;
		var player = PlayerMgr.GetPlayer(callCardPlayerID);
		player.callCard();
	},

	this.GetCardData = function(id){
		var cardData = this._cardMgr.getCardData(id);
		return cardData;
	},

	this.GetCardMgr = function(){
		return this._cardMgr;
	},

	//每帧刷新
	this.Update = function(){

	}

}