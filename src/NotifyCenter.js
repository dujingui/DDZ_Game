
function NotityCenter(){
	if(typeof this.instance == 'object'){
		return this.instance;
	}

	this.instance = this;

	this.increase = 0;
	this.observerList = {};

	this.Subscribe = function(observer,func){
		if(!this.observerList[observer]){
			this.observerList[observer] = [];
		}

		var token = this._getToken();
		var observeObj = {
			token : token,
			func : func
		};

		this.observerList[observer].push(observeObj);

		return token;
	},

	this.Publish = function(observer,params){
		if(this.observerList[observer]){
			var observerList = this.observerList[observer];
			for(var i = 0;i < observerList.length;i ++){
				var observeObj = observerList[i];
				observeObj.func(params);
			}
		}
	},

	this.Unsubscribe = function(token){
		for(var key in this.observerList){
			var observers = this.observerList[key];
			for(var i = 0;i < observers.length;i ++){
				var observer = observers[i];
				if(observer.token == token){
					observers.splice(i,1);
				}
			}
		}
	},

	this._getToken = function(){
		return this.increase++;
	}  
};

var Game_Notify_Center = new NotityCenter();