
var Util = {
	GetRandomNum : function(min,max){
		var Range = max - min;   
		var Rand = Math.random();   
		return(min + Math.round(Rand * Range));   
	},

	//数组array中是否包含element元素
	IsContain : function(array,element){
		for(var i = 0;i < array.length; i++){
			if(array[i] === element){
				return true;
			}
		}
		return false;
	}
}