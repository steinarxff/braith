/*

    Timing

    Just something to measure tick execution time, average over 50 and average over 1000.

    Closely coupled to the terminal thing.

    Status: Some cleaning up, mostly finished

 */

var _timer = function(){


    return {

        last50: [],
        last1000: [],

        last: 0,
        lastStored: 0,

        init: function(){
            this.measureStart = this._start.bind(this);
            this.measureStop = this._stop.bind(this);
            this.getTime = this._getTime.bind(this);
            this.getValues = this._getValues.bind(this);
        },

        _start: function(){
            this.last = this.getTime();
        },

        _stop: function(){
            var diff = this.getTime() - this.last;

            if(this.last50.length < 51) {
                this.last50.pop();
            }

            if(this.last1000.length < 1001){
                this.last1000.pop();
            }

            this.lastStored = diff;

            this.last50.push(diff);
            this.last1000.push(diff);
        },

        _getTime: function(){
            return (new Date()).getTime();
        },

        _getValues: function(){
            return {
                last: this.lastStored + " ms",
                last50: Math.round(this.last50.reduce(function(a, b){return a+b;}) / 50) + " ms",
                last1000: Math.round(this.last50.reduce(function(a, b){return a+b;}) / 50) + " ms"
            }
        }
    }
}();

_timer.init();

try {
    if (module) {
        module.exports = _timer;
    }
} catch (e) {
    var TIMER = _timer;
}