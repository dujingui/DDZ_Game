//牌型组
var CardTypeGroup = function(){

	this.singleCardGroups 		= null;		//单牌组
	this.sigleStraightGroups 	= null;		//单顺组
	this.doubleCardGroups 		= null;		//双牌组
	this.doubleStraightGroups 	= null;		//双牌组
	this.threeAndOneGroups 		= null; 	//3带1组
	this.bombGroups 			= null;		//炸弹组
	this.rocketGroups 			= null;		//火箭组

	this.setSigleCardGroups = function(groups){
		this.singleCardGroups = groups;
	},

	this.getSigleCardGroups = function(){
		return this.singleCardGroups;
	},

	this.discard = function(type, index){
		var cards = null;
		switch(type){
			case CardDef.CardPatterns.CCP_Single:
			{
				cards = this.singleCardGroups.splice(index, 1);
				break;
			}
			default:
				break;
		}
		return cards[0];
	},

	//从单牌组获得最小的一张单牌
	this.getSigleCard = function(){
		if(this.singleCardGroups.length > 0){
			var sigleCard = this.singleCardGroups.splice(0, 1);
			return sigleCard[0];
		}
		return null;
	},

	this.setSigleStraightGroups = function(groups){
		this.sigleStraightGroups = groups;
	},

	this.setDoubleCardGroups = function(groups){
		this.doubleCardGroups = groups;
	},

	this.setDoubleStraightGroupss = function(groups){
		this.doubleStraightGroups = groups;
	},

	this.setThreeAndOneGroups = function(groups){
		this.threeAndOneGroups = groups;
	},

	this.setBombGroups = function(groups){
		this.bombGroups = groups;
	},

	this.setRocketGroups = function(groups){
		this.rocketGroups = groups;
	}
}