
var GameScene = cc.Scene.extend({

	ctor:function(){
		this._super();

		this.init();
	},

	init : function(){
		var gameLayer = new GameLayer();
		this.addChild(gameLayer);
	}

});