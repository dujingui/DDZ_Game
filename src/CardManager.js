
function CardManager(){
	if(typeof this.instance === 'object'){
		return this.instance;
	}

	this.instance = this;

	this._cards = null;

	this.createCards = function(){
		var cards = [];

		//红桃
		cards.push(new Card(CardDef.CardColor.CC_Hearts,12,1,1));
		cards.push(new Card(CardDef.CardColor.CC_Hearts,13,2,2));
		cards.push(new Card(CardDef.CardColor.CC_Hearts,1,3,3));
		cards.push(new Card(CardDef.CardColor.CC_Hearts,2,4,4));
		cards.push(new Card(CardDef.CardColor.CC_Hearts,3,5,5));
		cards.push(new Card(CardDef.CardColor.CC_Hearts,4,6,6));
		cards.push(new Card(CardDef.CardColor.CC_Hearts,5,7,7));
		cards.push(new Card(CardDef.CardColor.CC_Hearts,6,8,8));
		cards.push(new Card(CardDef.CardColor.CC_Hearts,7,9,9));
		cards.push(new Card(CardDef.CardColor.CC_Hearts,8,10,10));
		cards.push(new Card(CardDef.CardColor.CC_Hearts,9,11,11));
		cards.push(new Card(CardDef.CardColor.CC_Hearts,10,12,12));
		cards.push(new Card(CardDef.CardColor.CC_Hearts,11,13,13));

		//黑桃
		cards.push(new Card(CardDef.CardColor.CC_Spades,12,1,14));
		cards.push(new Card(CardDef.CardColor.CC_Spades,13,2,15));
		cards.push(new Card(CardDef.CardColor.CC_Spades,1,3,16));
		cards.push(new Card(CardDef.CardColor.CC_Spades,2,4,17));
		cards.push(new Card(CardDef.CardColor.CC_Spades,3,5,18));
		cards.push(new Card(CardDef.CardColor.CC_Spades,4,6,19));
		cards.push(new Card(CardDef.CardColor.CC_Spades,5,7,20));
		cards.push(new Card(CardDef.CardColor.CC_Spades,6,8,21));
		cards.push(new Card(CardDef.CardColor.CC_Spades,7,9,22));
		cards.push(new Card(CardDef.CardColor.CC_Spades,8,10,23));
		cards.push(new Card(CardDef.CardColor.CC_Spades,9,11,24));
		cards.push(new Card(CardDef.CardColor.CC_Spades,10,12,25));
		cards.push(new Card(CardDef.CardColor.CC_Spades,11,13,26));

		//方片
		cards.push(new Card(CardDef.CardColor.CC_Diamonds,12,1,27));
		cards.push(new Card(CardDef.CardColor.CC_Diamonds,13,2,28));
		cards.push(new Card(CardDef.CardColor.CC_Diamonds,1,3,29));
		cards.push(new Card(CardDef.CardColor.CC_Diamonds,2,4,30));
		cards.push(new Card(CardDef.CardColor.CC_Diamonds,3,5,31));
		cards.push(new Card(CardDef.CardColor.CC_Diamonds,4,6,32));
		cards.push(new Card(CardDef.CardColor.CC_Diamonds,5,7,33));
		cards.push(new Card(CardDef.CardColor.CC_Diamonds,6,8,34));
		cards.push(new Card(CardDef.CardColor.CC_Diamonds,7,9,35));
		cards.push(new Card(CardDef.CardColor.CC_Diamonds,8,10,36));
		cards.push(new Card(CardDef.CardColor.CC_Diamonds,9,11,37));
		cards.push(new Card(CardDef.CardColor.CC_Diamonds,10,12,38));
		cards.push(new Card(CardDef.CardColor.CC_Diamonds,11,13,39));

		//梅花
		cards.push(new Card(CardDef.CardColor.CC_Clubs,12,1,40));
		cards.push(new Card(CardDef.CardColor.CC_Clubs,13,2,41));
		cards.push(new Card(CardDef.CardColor.CC_Clubs,1,3,42));
		cards.push(new Card(CardDef.CardColor.CC_Clubs,2,4,43));
		cards.push(new Card(CardDef.CardColor.CC_Clubs,3,5,44));
		cards.push(new Card(CardDef.CardColor.CC_Clubs,4,6,45));
		cards.push(new Card(CardDef.CardColor.CC_Clubs,5,7,46));
		cards.push(new Card(CardDef.CardColor.CC_Clubs,6,8,47));
		cards.push(new Card(CardDef.CardColor.CC_Clubs,7,9,48));
		cards.push(new Card(CardDef.CardColor.CC_Clubs,8,10,49));
		cards.push(new Card(CardDef.CardColor.CC_Clubs,9,11,50));
		cards.push(new Card(CardDef.CardColor.CC_Clubs,10,12,51));
		cards.push(new Card(CardDef.CardColor.CC_Clubs,11,13,52));

		//大小王
		cards.push(new Card(CardDef.CardColor.CC_DigJoker,14,14,53));
		cards.push(new Card(CardDef.CardColor.CC_SmallJoker,15,15,54));

		this._cards = cards;

		return cards;
	},

	this.shuffle = function(){
		if(this._cards){
			for(var i = 0;i < CardDef.CardNum;i ++){
				var randomNum = Util.GetRandomNum(0,CardDef.CardNum - 1);
				var temp = this._cards[randomNum];
				this._cards[randomNum] = this._cards[i];
				this._cards[i] = temp;
			}
		}
	},

	this.sort = function(cards){
		if(cards){
			var len = cards.length;
			for(var i = 0; i < len - 1; i ++){
				var valuei = this.getCardValue(cards[i]);
				for(var j = i + 1; j < len; j ++){
					var valuej = this.getCardValue(cards[j]);
					if(valuei < valuej){
						var temp = cards[i];
						cards[i] = cards[j];
						cards[j] = temp;

						valuei = this.getCardValue(cards[i]);
					}
				}
			}
		}
	},

	this.getCardData = function(soleid){
		var card = null;
		if(this._cards){
			var cards = this._cards;
			for(var i = 0;i < cards.length;i ++){
				var tempCard = cards[i];
				if(tempCard.soleID === soleid){
					card = tempCard;
					break;
				}
			}
		}
		return card;
	},

	this.getCardValue = function(soleid){
		var value = -1;
		if(this._cards){
			var cards = this._cards;
			for(var i = 0;i < cards.length;i ++){
				var card = cards[i];
				if(card.soleID === soleid){
					value = card.value;
					break;
				}
			}
		}
		return value;
	},

	this.getSoleIDByIndex = function(index){
		if(this._cards){
			return this._cards[index].soleID;
		}
		return -1;
	}
};
