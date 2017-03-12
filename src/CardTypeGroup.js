//牌型组
var CardTypeGroup = function(){

	this.singleCardGroups = [];		//单牌组
	this.sigleStraightGroups = [];	//单顺组
	this.doubleCardGroups = [];		//双牌组
	this.doubleStraightGroups = [];		//双牌组
	this.threeAndOneGroups = []; //3带1组
	this.bombGroups = [];	//炸弹组
	this.rocketGroups = [];//火箭组

	this.setSigleCardGroups = function(groups){
		this.singleCardGroups = groups;
	},

	this.getSigleCardGroups = function(){
		return this.singleCardGroups;
	},

	this.getSigleCard = function(){
		if(this.singleCardGroups.length > 0){
			var sigleCard = this.singleCardGroups.splice(0, 1);
			return sigleCard;
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