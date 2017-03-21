
var CardDef = {};

// CardDef.CardNum = 54;

CardDef.CardColor = {
	CC_Hearts 		: 0,	//红桃
	CC_Spades 		: 1,	//黑桃
	CC_Diamonds 	: 2,	//方片
	CC_Clubs 		: 3,	//梅花
	CC_DigJoker 	: 4,	//大王
	CC_SmallJoker 	: 5 	//小王
};

CardDef.CardPatterns = {
	CCP_Single 				: 0,	//单牌
	CCP_Single_Straight		: 1, 	//单顺
	CCP_Double 				: 2, 	//对牌
	CCP_Double_Straight		: 3,	//双顺
	CCP_ThreeAndOne			: 4,	//3带1
	CCP_Bomb				: 5,	//炸弹
	CCP_Rocket				: 6,	//火箭

	CCP_Max					: 7,	//牌型判断
};