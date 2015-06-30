#!/usr/bin/env node

var FASTMAP = require("collections/fast-map"),
	SOCKET = require("./server-socket.js"),
	TIMER = require("./timer.js"),
	RULES = require("./rules.js"),
	COLORS = require("./colors.js"),
	OBJECTS = require("./server-objects.js"),
	TRAFFIC = require("./traffic.js"),
	Victor = require('victor'),
	TERMINAL = require('./server-terminal.js'),
	Player = OBJECTS.Player,
	Shot = OBJECTS.Shot;


var engine = function(){	
    return {
    	passive: new FASTMAP(),
    	active: new FASTMAP(),
    	sockjs: SOCKET,
    	colors: COLORS,
		winRedraw: 50,

    	init: function(){
    		var me = this;
    		me.sockjs.on('connection', me.onConnect.bind(me));
    		me.tickThrough = me._tickThrough.bind(me);

    		setInterval(me.tick.bind(me), RULES.ENGINE_TICK);
			setInterval(me.terminalTick.bind(me), RULES.TERMINAL_TICK);


			console.log = function(k){
				TERMINAL.writeStatus("log", k);
			}
    	},

    	addShot: function(player, x, y){
    		var shot = new Shot({
    			target: {
    				x: x,
    				y: y
    			},
    			player: player
    		});

    		this.broadcast("+object", shot.get.call(shot));

    		this.passive.add(shot, shot.id);
    	},


		terminalTick: function(){
			TERMINAL.writeStatus("timer", TIMER);
			TERMINAL.writeStatus("traffic", TRAFFIC);
			TERMINAL.writeStatus("objects", {
				players: this.active.length,
				passive: this.passive.length
			});
			TERMINAL.writeStatus("memory", process.memoryUsage());
			TERMINAL.refresh();
		},

    	tick: function(){
			TIMER.measureStart();

    		this.broadcast("state",[].concat(this.tickThrough(this.active)).concat(this.tickThrough(this.passive)));

			this.crashTest();

			TIMER.measureStop();
    	},

		crashTest: function(){
			var shot, player, me = this;

			me.passive.forEach(function(v){
				shot = new Victor(v.x, v.y);

				if(v.active) {
					me.active.forEach(function (x) {
						if(x.alpha > 40){ // if not under active respawn
							player = new Victor(x.x, x.y);
							if (player.distance(shot) < (RULES.PLAYER_SIZE + RULES.BULLET_SIZE)) {
								x.isHit(v);

								v.active = false;
								v.alpha = 0;

								if(x.id == v.player.id){
									// Suicide
									v.player.score--;
								}else{
									v.player.score++;
								}

								me.broadcast("score", {
									target: x.color.value,
									shooter: v.player.color.value
								});

								me.broadcast("stats",me.getScore());

							}
						}
					});
				}
			});
		},

    	_tickThrough: function(items){
    		var r = [], me = this;

    		items.forEach(function(v){
    			v.tick.call(v);

    			if(!v.active){
    				items.delete(v.id);
    				me.broadcast("-object", v.get.call(v));
    				delete v;
    			}else{
					r.push(v.get.call(v));    				
    			}
    		});

    		return r;
    	},

    	onConnect: function(conn){
    		// Create player and add to collection
			var me = this,
				p = new Player(conn, engine), t, a = [];

			// Broadcast the arrival of a new player
			me.broadcast("+object", p.get.call(p));

			// Send active players to the new player
			me.active.forEach(function(v){
				p.send("+object", v.get.call(v));
			});

			// Send passive objects to the new player
			me.passive.forEach(function(v){
				p.send("+object", v.get.call(v));
			});

			// Add the player to the collection of active players
			me.active.add(p, p.id);

			// Send identity to connection
			p.send('+self', p.get.call(p));
			p.send("stats", me.getScore());
    	},

    	broadcast: function(cmd, contents){
    		this.active.forEach(function(v){
				TRAFFIC.add(v.send(cmd, contents));
    		})
    	},

		getScore: function(){
			var total = [];

			this.active.forEach(function(v){
				total.push({
					color: v.color.value,
					score: v.score
				});
			});

			total = total.sort(function(a, b) {
				if (a.score < b.score) {
					return 1;
				}
				if (a.score > b.score) {
					return -1;
				}

				return 0;
			});

			return total;
		}
    }
}();


engine.init();