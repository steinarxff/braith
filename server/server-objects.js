/*

    Work in progress

 */

var uuid = require('node-uuid'),
    RULES = require('./rules.js'),
    Victor = require('victor');

function idGenerator(){
    this.id = uuid.v4();
}

function assign(obj){
    for(var k in obj){
        if(obj.hasOwnProperty(k)){
            this[k] = obj[k];
        }
    }
}

Shot = function(obj){
    var me = this;
    idGenerator.call(me);
    assign.call(me, obj);

    me.tickCount = 0;
    me.active = true;
    
    me.color = me.player.color.value;

    me.calc.call(this);
}

Shot.prototype = {
    constructor: Shot,
    type: 'shot',

    x: 0,
    y: 0,
    dX: 1,
    dY: 1,
    age: 0,
    alpha: 100,

    get: function(){
        return {
            "id": this.id,
            "type": this.type,
            "color": this.color,
            "x": this.x,
            "y": this.y,
            "alpha": this.alpha/100
        }
    },

    calc: function(){
        this.x = this.player.x;
        this.y = this.player.y;
        this.startP = new Victor(this.x, this.y);
        this.endP = new Victor(this.target.x, this.target.y);

        this.normal = this.endP.subtract(this.startP).normalize();

        this.x += 20 * this.normal.x;
        this.y += 20 * this.normal.y;
    },
    
    tick: function(){
        this.x += RULES.BULLET_SPEED * this.normal.x;
        this.y += RULES.BULLET_SPEED * this.normal.y;
        this.check();
    },

    check: function(){
        if(Math.abs(this.x) > RULES.SCREEN_WIDTH/2){
            this.normal.x = -this.normal.x;
        }
        if(Math.abs(this.y) > RULES.SCREEN_HEIGHT/2){
            this.normal.y = -this.normal.y;
        }

        this.age++;
        if(this.age > (RULES.BULLET_AGE-100)){
            this.alpha-=5;
        }

        if(this.alpha <= 0){
            this.active = false;
        }
    }
};

Player = function(conn, engine){
	var me = this;

    idGenerator.call(me);

    me.engine = engine;

    // Need to find non-bind solution for optimization reasons
    me.send = me._send.bind(me);
    me.get = me._get.bind(me);
    me.read = me._read.bind(me);
    me.check = me._check.bind(me);
    me.constrain = me._constrain.bind(me);
    me.shot = me._shot.bind(me);

    me.active = true;

    me.color = me.engine.colors.getAvailableColor();

	me.ip = conn.remoteAddress;
	me.conn = conn;

    me.conn.on('data', me._read.bind(me));

    me.conn.on('close', function(){
        me.engine.colors.freeColor(me.color.name);
        //console.log("Player (" + me.color.name + "): has left");
        me.active = false;
    });

    me.x = 0;
    me.y = 0;

    //me.x = RULES.SCREEN_WIDTH/4;
    //me.y = RULES.SCREEN_HEIGHT/4;

    //console.log("New player (" + me.color.name + "): " + conn.remoteAddress);
}

Player.prototype = {
	constructor: Player,

    type: 'player',
    x: 0,
    y: 0,
    dX: 0,
    dY: 0,
    left: false,
    right: false,
    up: false,
    down: false,
    stop: false,
    accelerate: false,
    fuel: 100,
    shotFuel: 100,
    shots: 3,
    hub: false,
    alpha: 100,
    score: 0,

    isHit: function(shot){
        this.alpha = 40;
        this.send("hit",{ shooter: shot.player.color.value });
    },

    _send: function(type, data){
        var k = JSON.stringify({
            type: type,
            data: data           
        });

        if(this.previous != k){
            this.conn.write(k);
            this.previous = k;
            return k;
        }

        return "";
    },

    _get: function(){
        return {
            "id": this.id,
            "type": this.type,
            "color": this.color,
            "x": this.x,
            "y": this.y,
            "fuel": this.fuel,
            "left": this.left,
            "right": this.right,
            "up": this.up,
            "down": this.down,
            "alpha": this.alpha / 100,
            "shots": Math.floor(this.shotFuel / RULES.SHOTFUEL_COST)
        }
    },

    set: function(v){
        return v.charAt(0) == '+'?true:false;
    },

    _read: function(v){
        switch(v){
            case '+accelerate':
            case '-accelerate':
                this.accelerate = this.set(v);
                return;
                break;
            case '+cyclone':
            case '-stop':
                this.stop = this.set(v);
                return;
                break;
            case '+left':
            case '-left':
                this.left = this.set(v);
                return;
                break;
            case '+right':
            case '-right':
                this.right = this.set(v);
                return;
                break;
            case '+up':
            case '-up':
                this.up = this.set(v);
                return;
                break;
            case '+down':
            case '-down':
                this.down = this.set(v);
                return;
                break;
        }

        if(v.indexOf(':') > -1){
            var temp = v.split(':');
            if(temp[0] == '+shot'){
                this.shot(temp[1],temp[2]);   
            }
        }
    },

    _shot: function(x,y){
        if(this.shotFuel > (RULES.SHOTFUEL_COST-1)){
            this.engine.addShot(this, Number(x), Number(y));
            this.shotFuel -= 25;
        }
    },
	   
    tick: function(){
        var factor = 1;



        if(this.fuel < 0){ 
            this.fuel = 1;
        }

        if(this.shotFuel < RULES.SHOTFUEL_MAX){
            this.shotFuel += RULES.SHOTFUEL_REGEN;
        }

        if(this.accelerate && this.fuel >= RULES.ACCELERATE_USAGE){
            this.fuel -= RULES.ACCELERATE_USAGE;
            factor = RULES.ACCELERATE_FACTOR;
        }else{
            this.fuel += RULES.ACCELERATE_REGEN;
            if(this.fuel > RULES.MAX_FUEL){
                this.fuel = RULES.MAX_FUEL;
            }
        }

        this.fuel = Math.round(this.fuel);

        if(this.fuel < 2){
            this.accelerate = false;
        }

       	if(this.left && !this.right){
         	this.dX -= RULES.PLAYER_MOVE*factor;
    	}

        if(this.right && !this.left){
            this.dX += RULES.PLAYER_MOVE*factor;
        }
        
        if(this.up && !this.down){
            this.dY -= RULES.PLAYER_MOVE*factor;
        }
        
        if(this.down && !this.up){
            this.dY += RULES.PLAYER_MOVE*factor;
        }

        if(!this.left && !this.right && this.dX != 0){
            if(Math.abs(this.dX) < RULES.PLAYER_MOVE){
               this.dX = 0;
            }else{
               if(this.dX < 0){
                  this.dX += RULES.PLAYER_MOVE;
               }else{
                  this.dX -= RULES.PLAYER_MOVE;
               }    
            }
        }

        if(!this.up && !this.down && this.dY != 0){
            if(Math.abs(this.dY) < RULES.PLAYER_MOVE){
               this.dY = 0;
            }else{
               if(this.dY < 0){
                  this.dY += RULES.PLAYER_MOVE;
               }else{
                  this.dY -= RULES.PLAYER_MOVE;
               }
            }
        }

        this.check();

        if(this.alpha < 100){
            this.alpha--;
            this.dX = 0;
            this.dY = 0;
        }

        if(this.alpha < 1){
            this.x = 0;
            this.y = 0;
        }

        if(this.alpha == -200){
            this.alpha = 100;
            this.send('wake', {});
        }

        this.x += this.dX;
        this.y += this.dY;

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        this.constrain();
    },

    _constrain: function(){
        if((this.x + RULES.PLAYER_SIZE) > (RULES.SCREEN_WIDTH/2)){
            // Roof
            this.x = RULES.SCREEN_WIDTH / 2;
            this.x -= RULES.PLAYER_SIZE;
            this.dX = 0;
        }

        if((this.x - RULES.PLAYER_SIZE) < -(RULES.SCREEN_WIDTH/2)){
            // Roof
            this.x = -RULES.SCREEN_WIDTH / 2;
            this.x += RULES.PLAYER_SIZE;
            this.dX = 0;
        }

        if((this.y + RULES.PLAYER_SIZE) > (RULES.SCREEN_HEIGHT/2)){
            // Roof
            this.y = RULES.SCREEN_HEIGHT / 2;
            this.y -= RULES.PLAYER_SIZE;
            this.dY = 0;
        }

        if((this.y - RULES.PLAYER_SIZE) < -(RULES.SCREEN_HEIGHT/2)){
            // Roof
            this.y = -RULES.SCREEN_HEIGHT / 2;
            this.y += RULES.PLAYER_SIZE;
            this.dY = 0;
        }

    },

    _check: function(){
        var factor = 1;

        if(this.accelerate){
            factor = RULES.ACCELERATE_FACTOR;
        }

        if(this.dX > (RULES.PLAYER_MOVE_MAX*factor)){
            this.dX = RULES.PLAYER_MOVE_MAX*factor;
        }
        if(this.dX < -(RULES.PLAYER_MOVE_MAX*factor)){
            this.dX = -RULES.PLAYER_MOVE_MAX*factor;
        }
        if(this.dY > (RULES.PLAYER_MOVE_MAX*factor)){
            this.dY = RULES.PLAYER_MOVE_MAX*factor;
        }
        if(this.dY < -(RULES.PLAYER_MOVE_MAX*factor)){
            this.dY = -RULES.PLAYER_MOVE_MAX*factor;
        }
    }
}

module.exports.Player = Player;
module.exports.Shot = Shot;