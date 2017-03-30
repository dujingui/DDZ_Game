
function PlayerMgr(){
	if(typeof this.instance == 'object'){
		return this.instance;
	}

	this.instance = this;
	this.id = 1;
	this.firstRobPlayer = null;	//记录首次抢地主的玩家
	this.players = [];

	this.SetFirstRobPlayer = function(id){
		this.firstRobPlayer = id;
	},

	this.GetFirstRobPlayer = function(){
		return this.firstRobPlayer;
	},

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

	//获得成为地主的玩家
	this.GetLandlordPlayer = function(){
		for(var i = 0;i < 3;i ++){
			if(this.players[i].isLandlord()){
				return this.players[i].getID();
			}
		}
		return -1;
	},

	//有没有玩家抢地主
	this.isHasPlayerRob = function(){
		for(var i = 0;i < 3;i ++){
			if(this.players[i].isRob()){
				return true;
			}
		}
		return false;
	},

	//获得抢过地主的玩家
	this.getRobPlayers = function(){
		var players = [];
		for(var i = 1;i <= 3;i ++){
			var player = this.GetPlayer(i);
			if(player.isRob()){
				players.push(i);
			}	
		}	
		return players;
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