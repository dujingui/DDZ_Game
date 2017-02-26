
function PlayerMgr(){
	if(typeof this.instance == 'object'){
		return this.instance;
	}

	this.instance = this;
	this.id = 1;
	this.players = [];

	this.CreatePlayer = function(fileName,isAI){
		var player = new Player(fileName,isAI);
		var playerid = this._getID();
		player.setID(playerid);
		this.players.push(player);
		return player;
	},

	this.GetPlayer = function(id){
		for(var i = 0;i < this.players.length;i ++){
			if(this.players[i].getID() == id){
				return this.players[i];
			}
		}
		return null;
	},

	this.GetPlayerByIndex = function(index){
		if(this.players[index]){
			return this.players[index];
		}
		return null;
	},

	//有没有玩家抢地主
	this.IsRob = function(){
		for(var i = 0;i < 3;i ++){
			if(this.players[i].isRob()){
				return true;
			}
		}
		return false;
	},

	this.IsAI = function(id){
		var player = this.GetPlayer(id);
		return player.isAI();
	},

	this._getID = function(){
		var id = this.id ++;
		return id;
	}
};

var PlayerMgr = new PlayerMgr();