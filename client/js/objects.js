/*

    Work in progress

 */


Shot = function(obj){
    var me = this;
    me.id = obj.id;
    me.type = obj.type;
    me.color = obj.color;

    me.o = new PIXI.Graphics();
    me.o.beginFill(~~("0x"+obj.color));
    me.o.lineStyle(1, 0x000000,1);

    me.o.drawCircle(RULES.SCREEN_WIDTH/2, RULES.SCREEN_HEIGHT/2, RULES.BULLET_SIZE);
    me.read(obj);

    me.o.endFill();
}

Shot.prototype = {
    constructor: Shot,
    fading: false,

    get: function(){
        return this.o;
    },

    read: function(obj){
        this.o.alpha = obj.alpha;
        this.o.position.x = obj.x;
        this.o.position.y = obj.y;
    }
}

Player = function(obj){
    var me = this;

    me.id = obj.id;
    me.type = obj.type;
    me.o = new PIXI.Graphics();

    me.color = obj.color;
    me.o.beginFill(~~("0x"+obj.color.value));
    
    me.self = obj.self;

    if(self === true){
        me.o.lineStyle(2, 0x000000,1);   
    }else{
        me.o.lineStyle(2, 0x000000,1);
    }

    me.oLeft = new PIXI.Graphics();
    me.oLeft.beginFill(~~("0x"+obj.color.value));
    me.oLeft.lineStyle(1, 0x000000,1);
    //me.oLeft.drawCircle(RULES.SCREEN_WIDTH/2 - (RULES.PLAYER_SIZE+2), RULES.SCREEN_HEIGHT/2, RULES.PLAYER_ROCKET_SIZE);
    me.oLeft.drawEllipse(RULES.SCREEN_WIDTH/2, RULES.SCREEN_HEIGHT/2, RULES.PLAYER_ROCKET_SIZE * 2, RULES.PLAYER_ROCKET_SIZE);
    //me.oLeft.drawCircle(RULES.SCREEN_WIDTH/2, RULES.SCREEN_HEIGHT/2, RULES.PLAYER_ROCKET_SIZE);
    me.oLeft.position.x -= RULES.PLAYER_SIZE;
    me.oLeft.endFill();

    me.oRight = new PIXI.Graphics();
    me.oRight.beginFill(~~("0x"+obj.color.value));
    me.oRight.lineStyle(1, 0x000000,1);
    //me.oRight.drawCircle(RULES.SCREEN_WIDTH/2 + (RULES.PLAYER_SIZE+2), RULES.SCREEN_HEIGHT/2, RULES.PLAYER_ROCKET_SIZE);
    me.oRight.drawEllipse(RULES.SCREEN_WIDTH/2, RULES.SCREEN_HEIGHT/2, RULES.PLAYER_ROCKET_SIZE * 2, RULES.PLAYER_ROCKET_SIZE);
    me.oRight.position.x += RULES.PLAYER_SIZE;
    me.oRight.endFill();

    me.oUp = new PIXI.Graphics();
    me.oUp.beginFill(~~("0x"+obj.color.value));
    me.oUp.lineStyle(1, 0x000000,1);
    //me.oUp.drawCircle(RULES.SCREEN_WIDTH/2, RULES.SCREEN_HEIGHT/2 - (RULES.PLAYER_SIZE+2), RULES.PLAYER_ROCKET_SIZE);
    me.oUp.drawEllipse(RULES.SCREEN_WIDTH/2, RULES.SCREEN_HEIGHT/2, RULES.PLAYER_ROCKET_SIZE, RULES.PLAYER_ROCKET_SIZE * 2);
    me.oUp.position.y -= RULES.PLAYER_SIZE;
    me.oUp.endFill();

    me.oDown = new PIXI.Graphics();
    me.oDown.beginFill(~~("0x"+obj.color.value));
    me.oDown.lineStyle(1, 0x000000,1);
    //me.oDown.drawCircle(RULES.SCREEN_WIDTH/2, RULES.SCREEN_HEIGHT/2 + (RULES.PLAYER_SIZE+2), RULES.PLAYER_ROCKET_SIZE);
    me.oDown.drawEllipse(RULES.SCREEN_WIDTH/2, RULES.SCREEN_HEIGHT/2, RULES.PLAYER_ROCKET_SIZE, RULES.PLAYER_ROCKET_SIZE * 2);
    me.oDown.position.y += RULES.PLAYER_SIZE;
    me.oDown.endFill();

    me.o.addChild(me.oLeft);
    me.o.addChild(me.oRight);
    me.o.addChild(me.oUp);
    me.o.addChild(me.oDown);

    me.o.drawCircle(RULES.SCREEN_WIDTH/2, RULES.SCREEN_HEIGHT/2, RULES.PLAYER_SIZE);

    me.o.endFill();


    me.read.call(me,obj);
}

Player.prototype = {
    constructor: Player,
    fuel: 0,

    read: function(obj){
        this.oLeft.visible = obj.right;
        this.oRight.visible = obj.left;
        this.oDown.visible = obj.up;
        this.oUp.visible = obj.down;
        this.o.position.x = obj.x;
        this.o.position.y = obj.y;
        this.fuel = obj.fuel;
        this.shots = obj.shots;
        this.o.alpha = obj.alpha;
    },
    
    get: function(){
        return this.o;
    },

    setPos: function(x, y){
        this.o.position.x = x;
        this.o.position.y = y;
    }
}