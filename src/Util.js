
var Util = {
	GetRandomNum : function(min,max){
		var Range = max - min;   
		var Rand = Math.random();   
		return(min + Math.round(Rand * Range));   
	}
}