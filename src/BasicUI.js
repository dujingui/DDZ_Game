//UI基类
	
var BasicUI = cc.Node.extend({

	ctor : function(){
		this._super();

		this._initUI();
	},

	//虚函数
	_initUI :function(){

	},

	getLabelDef : function(){
		var def = new cc.FontDefinition(); // 声明文字定义
		def.fontName = "楷体"; // 字体
		def.fontSize = 40; // 字号大小
		def.textAlign = cc.TEXT_ALIGNMENT_CENTER; // 文字对齐
		def.fillStyle = cc.color(100,100,100,0); // 字体(内部)颜色
		def.strokeEnabled = true; // 开启文字描边效果
		def.strokeStyle = cc.color("#000000"); // 描边的颜色
		def.lineWidth = 1; // 字体的宽度
		def.shadowOffsetX = 4; // 阴影X轴效果
		def.shadowOffsetY = 4; // 阴影Y轴效果

		return def;
	},
});