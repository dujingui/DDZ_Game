
var Game_UI_Type = {
	GUT_Self_CallCard 			: 'selfCallCard',//自己叫牌UI
	GUT_AI_Wait            		: 'aiWait',		//AI等待UI
	GUT_CALL_RESULT_LABEL		: 'callResultLabel', //叫牌结果文字
	GUT_Self_Rob_Landlord		: 'selfRobLandlord', //自己抢地主UI
	GUT_ROB_RESULT_LABEL		: 'robLandlordResult',//抢地主结果文字
	GUT_DISCARD_RESULT 			: 'discardResult',//出牌结果
	GUI_SELF_DISCARD            : 'selfDiscard', //出牌UI
	GUI_NOT_FOLLOW              : 'notFollowUI',//不跟牌UI
};

function Game_UI_Mgr(){
	if(typeof this.instance == 'object'){
		return this.instance;
	}

	this.instance = this;

	this.ShowUI = function(type,params){
		if(type in this){
			this[type](params);
		}
	},

	this.Update = function(){

	},

	this.RemoveTempUI = function(id){
		var player = PlayerMgr.GetPlayer(id);
		var tempUI = player.getTempUI();
		if(tempUI){
			var parent = cc.director.getRunningScene();
			parent.removeChildByTag(tempUI,true);
			player.setTempUI(null);
		}
	},

	this.RemoveAllTempUI = function(){
		for(var i = 0;i < 3;i ++){
			var player = PlayerMgr.GetPlayerByIndex(i);
			var tempUI = player.getTempUI();
			if(tempUI){
				var parent = cc.director.getRunningScene();
				parent.removeChildByTag(tempUI);
				player.setTempUI(null);
			}
		}
	},

	this.discardResult = function(params){
		var cards = params.cards;
		var size = cc.winSize;
		var playerid = params.player_id;
		var player = PlayerMgr.GetPlayer(playerid);
		var parent = cc.director.getRunningScene();
		var initPosX,initPosY;
		var node = new cc.Node();
		var tag = 'discard-ui';
		var cardSize = cc.size(56, 75);
		var offset = 30;
		var count = 0;
		if(!cards){
			var a = 0;
		}
		for(var i = 0;i < cards.length;i ++){
			var cardSoleID = cards[i];
			var cardData = Game_Card_Mgr.getCardData(cardSoleID);
			var cardui = new CardUI(cardData, true);
			cardui.setPosition(i * offset, 0);
			node.addChild(cardui);
			count ++;
		}
		var allCardWidth = (count - 1) * offset + cardSize.width;
		if(playerid === 1){
			initPosX = size.width / 2 - allCardWidth / 2;
			initPosY = size.height * 0.4;
		}else if(playerid == 2){
			initPosX = size.width * 0.8 - allCardWidth;
			initPosY = size.height * 0.6;
		}else if(playerid == 3){
			initPosX = size.width * 0.2;
			initPosY = size.height * 0.6;
		}
		node.setTag(tag);
		player.setTempUI(tag);
		node.setPosition(initPosX,initPosY);
		parent.addChild(node);
	},

	this.aiWait = function(params){
        var size = cc.winSize;
		var waitTime = 30;
		var parent = cc.director.getRunningScene();
		var player = PlayerMgr.GetPlayer(params.player_id);

		var tag = 'wait-ui_' + params.player_id;
		var clockUI = new cc.Sprite(res.clock);
		var numUI = new cc.LabelAtlas(waitTime,res.num2,40,42,"0");
		numUI.setAnchorPoint(0.5,0.5);
		numUI.setScale(0.6);
		clockUI.setTag(tag);
		player.setTempUI(tag);
		var temp = clockUI.getContentSize();
		if(params.player_id == 2){
			clockUI.setPosition(size.width * 0.8,size.height * 0.65);
		}else{
			clockUI.setPosition(size.width * 0.2,size.height * 0.65);
		}
		numUI.setPosition(temp.width * 0.5,temp.height * 0.4);
		parent.addChild(clockUI);
		clockUI.addChild(numUI);

		var func = function(){
			numUI.setString(--waitTime);
		};

		clockUI.schedule(func,1);
	},

	//不跟牌UI
	this.notFollowUI = function(params){
        var size = cc.winSize;
		var parent = cc.director.getRunningScene();
		var player = PlayerMgr.GetPlayer(params.player_id);

		var text = '不出';
		var x,y,tag = 'not-follow';
		if(params.player_id == 1){
			x = size.width * 0.5,y = size.height * 0.35;
		}else if(params.player_id == 2){
			x = size.width * 0.8,y = size.height * 0.6;
		}else if(params.player_id == 3){
			x = size.width * 0.2,y = size.height * 0.6;
		}
		var def = this.getLabel2Def();
		var label = new cc.LabelTTF(text,def);
		label.setAnchorPoint(0.5,0.5);
		label.setPosition(x,y);
		label.setTag(tag);
		parent.addChild(label);
		player.setTempUI(tag);
	},

	this.callResultLabel = function(params){
        var size = cc.winSize;
		var parent = cc.director.getRunningScene();

		var text = '叫地主';
		var player = PlayerMgr.GetPlayer(params.player_id);
		if(!params.is_call){
			text = "不叫";
		}
		var x,y,tag = 'call-ui';
		if(params.player_id == 1){
			x = size.width * 0.5,y = size.height * 0.35;
		}else if(params.player_id == 2){
			x = size.width * 0.8,y = size.height * 0.6;
		}else if(params.player_id == 3){
			x = size.width * 0.2,y = size.height * 0.6;
		}
		var def = this.getLabel2Def();
		var label = new cc.LabelTTF(text,def);
		label.setAnchorPoint(0.5,0.5);
		label.setPosition(x,y);
		label.setTag(tag);
		parent.addChild(label);
		player.setTempUI(tag);
	},

	this.robLandlordResult = function(params){
        var size = cc.winSize;
		var parent = cc.director.getRunningScene();
		var player = PlayerMgr.GetPlayer(params.player_id);
		var text = '抢地主';
		if(!params.is_rob){
			text = "不抢";
		}
		var tag = 'rob-landlord';
		var def = this.getLabel2Def();
		var label = new cc.LabelTTF(text,def);
		label.setAnchorPoint(0.5,0.5);
		label.setTag(tag);
		player.setTempUI(tag);
		parent.addChild(label);
		if(params.player_id == 2){
			label.setPosition(size.width * 0.8,size.height * 0.6);
		}else if(params.player_id == 3){
			label.setPosition(size.width * 0.2,size.height * 0.6);
		}else if(params.player_id == 1){
			label.setPosition(size.width * 0.5,size.height * 0.35);
		}
	},

	this.selfDiscard = function(params){
		var parent = cc.director.getRunningScene();
		var discardUI = new DiscardPhasesUI();
		parent.addChild(discardUI);
	},

	this.selfCallCard = function(params){
        var size = cc.winSize;

		var parent = cc.director.getRunningScene();

		var callBtn = new ccui.Button(res.normal_btn,res.press_btn);
		var noCallBtn = new ccui.Button(res.normal_btn,res.press_btn);
		callBtn.setScale(0.6);
		noCallBtn.setScale(0.6);
		callBtn.type = 'call';
		noCallBtn.type = 'no-call';
		callBtn.setPosition(size.width * 0.4,size.height * 0.35);
		noCallBtn.setPosition(size.width * 0.6,size.height * 0.35);
		parent.addChild(callBtn);
		parent.addChild(noCallBtn);

		var def = this.getLabelDef();

		var callLabel1 = new cc.LabelTTF("叫地主",def);
		var callLabel2 = new cc.LabelTTF("不叫",def);
		callLabel1.setAnchorPoint(0.5,0.5);
		callLabel2.setAnchorPoint(0.5,0.5);
		var btnsize = callBtn.getContentSize();
		callLabel1.setPosition(btnsize.width * 0.5,btnsize.height * 0.5);
		callLabel2.setPosition(btnsize.width * 0.5,btnsize.height * 0.5);

		noCallBtn.addChild(callLabel2);
		callBtn.addChild(callLabel1);

		var callback = function(sender,type){
			if(type == ccui.Widget.TOUCH_ENDED){
				callBtn.removeFromParent();
				noCallBtn.removeFromParent();
				var isCall = sender.type == 'call';
				Game_Event_Center.DispatchEvent(
					EventType.ET_CLICK_CALL_BTN,
					{is_call:isCall}
				);
			}
		};

		callBtn.addTouchEventListener(callback);
		noCallBtn.addTouchEventListener(callback);
	},

	this.selfRobLandlord = function(params){
        var size = cc.winSize;
		var parent = cc.director.getRunningScene();

		var robBtn = new ccui.Button(res.normal_btn,res.press_btn);
		var noRobBtn = new ccui.Button(res.normal_btn,res.press_btn);
		robBtn.setScale(0.6);
		noRobBtn.setScale(0.6);
		robBtn.type = 'rob';
		noRobBtn.type = 'no-rob';
		robBtn.setPosition(size.width * 0.4,size.height * 0.35);
		noRobBtn.setPosition(size.width * 0.6,size.height * 0.35);
		parent.addChild(robBtn);
		parent.addChild(noRobBtn);

		var def = this.getLabelDef();

		var callback = function(sender,type){
			if(type == ccui.Widget.TOUCH_ENDED){
				var isrob = sender.type == 'rob';
				robBtn.removeFromParent();
				noRobBtn.removeFromParent();
				Game_Event_Center.DispatchEvent(EventType.ET_CLICK_ROB_BTN,{is_rob:isrob});
			}
		};

		var callLabel1 = new cc.LabelTTF("抢地主",def);
		var callLabel2 = new cc.LabelTTF("不抢",def);
		callLabel1.setAnchorPoint(0.5,0.5);
		callLabel2.setAnchorPoint(0.5,0.5);
		var btnsize = robBtn.getContentSize();
		callLabel1.setPosition(btnsize.width * 0.5,btnsize.height * 0.5);
		callLabel2.setPosition(btnsize.width * 0.5,btnsize.height * 0.5);

		noRobBtn.addChild(callLabel2);
		robBtn.addChild(callLabel1);

		robBtn.addTouchEventListener(callback);
		noRobBtn.addTouchEventListener(callback);
	},

	this.getLabelDef = function(){
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

	this.getLabel2Def = function(){
		var def = new cc.FontDefinition(); // 声明文字定义
		def.fontName = "楷体"; // 字体
		def.fontSize = 50; // 字号大小
		def.textAlign = cc.TEXT_ALIGNMENT_CENTER; // 文字对齐
		def.fillStyle = cc.color(255,255,0); // 字体(内部)颜色
		def.strokeEnabled = true; // 开启文字描边效果
		def.strokeStyle = cc.color(145,72,0); // 描边的颜色
		def.lineWidth = 3; // 字体的宽度
		def.shadowOffsetX = 4; // 阴影X轴效果
		def.shadowOffsetY = 4; // 阴影Y轴效果

		return def;
	}
};

var Game_UI_Mgr = new Game_UI_Mgr();