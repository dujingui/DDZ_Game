
function EventCenter(){
	if(typeof this.instance == 'object'){
		return this.instance;
	}

	this.instance = this;

	this.increase = 0;
	this.eventList = {};

	this.RegisterEvent = function(event_type,func){
		if(!this.eventList[event_type]){
			this.eventList[event_type] = [];
		}

		var token = this._getToken();
		var eventObj = {
			token : token,
			func : func
		};

		this.eventList[event_type].push(eventObj);
	},

	this.PublishEvent = function(event_type,other){
		if(this.eventList[event_type]){
			var eventList = this.eventList[event_type];
			for(var i = 0;i < eventList.length;i ++){
				var eventObj = eventList[i];
				eventObj.func(other);
			}
		}
	},

	this._getToken = function(){
		return this.increase++;
	}  
};

var EventCenter = new EventCenter();