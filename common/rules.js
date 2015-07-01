/*

    Rules and settings

    This hairy furball of a mess is where all the speeds, ticks,
    fuels and whatnot are defined.

    This file is used by both the client and the server.

    Status: Have to rewrite to separate speeds and regeneration from
            engine fps and move it to a clock-based approach. Aka, speed
            of player should be unchanged by change in engine fps.

 */

var ENGINE_FPS = 100,
    TERMINAL_FPS = 10,
    ENGINE_TICK = 1000 / ENGINE_FPS,
    TERMINAL_TICK = 1000 / TERMINAL_FPS;

var __o = {
    PLAYER_MOVE: 0.20,
    PLAYER_MOVE_MAX: 4,
    PLAYER_ROCKET_SIZE: 3,
    ACCELERATE_USAGE: 2,
    ACCELERATE_REGEN: 0.5,
    ACCELERATE_FACTOR: 2,
    MAX_FUEL: 100,
    SHOT_SPEED: 10,
    SCREEN_WIDTH: 800,
    SCREEN_HEIGHT: 600,
    SCREEN_BORDER: 4,
    PLAYER_SIZE: 10,
    DOT_SIZE: 2,
    BULLET_SPEED: 9,
    BULLET_SIZE: 4,
    BULLET_AGE: 150,
    SHOTFUEL_MAX: 100,
    SHOTFUEL_REGEN: 0.25,
    SHOTFUEL_COST: 25
};

for(var k in __o){
    if(__o.hasOwnProperty(k)){}
}

__o.ENGINE_TICK = ENGINE_TICK;
__o.TERMINAL_TICK = TERMINAL_TICK;


// To ensure this file can be included, and used, by both nodejs and browsers
try {
    if (module) {
        module.exports = __o;
    }
} catch (e) {
    var RULES = __o;
}
