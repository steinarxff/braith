var _traffic = function(){

    // http://buildnewgames.com/optimizing-websockets-bandwidth/
    var getUTF8Size =function( str ) {
        var sizeInBytes = str.split('')
            .map(function( ch ) {
                return ch.charCodeAt(0);
            }).map(function( uchar ) {
                return uchar < 128 ? 1 : 2;
            }).reduce(function( curr, next ) {
                return curr + next;
            });

        return sizeInBytes;
    };

    var units = ["B", "kB" , "MB", "TB"];

    var simplified = function(input){
        var unit = units[0];
        var i = 0;
        while (input > 1024 && ++i) {
            unit = units[i];
            input /= 1024;
        }
        return Math.round(input) + " " + unit;
    };

    return {
        bytes: {
            total: 0,
            average: 0
        },

        readable: {
            total: "0 B total",
            average: "0 B/s",
            packets: "0 p/s"
        },

        packets: 0,
        last: 0,
        test: "",

        init: function(){
            this.reset = this._reset.bind(this);
            this.add = this._add.bind(this);
            this.tick = this._tick.bind(this);

            setInterval(this.tick, 1000);
        },

        _tick: function(){
            this.readable.total = simplified(this.bytes.total) + " total";
            this.readable.average = simplified(this.bytes.average) + "/s";
            this.readable.packets = this.packets + " p/s";
            this.bytes.average = 0;
            this.packets = 0;
        },

        _reset: function(){
            this.bytes = {
                total: 0,
                average: 0
            };

            this.readable = {
                total: 0,
                average: 0
            };
        },

        _add: function(s,c){
            if(isNaN(s)){
                s = getUTF8Size(s);
            }

            if(isNaN(c)){
                c = 1;
            }

            s = s * c;

            if(s > 0){
                this.packets++;
                this.bytes.total += s;
                this.bytes.average += s;
            }
        }
    }
}();

_traffic.init();

try {
    if (module) {
        module.exports = _traffic;
    }
} catch (e) {
    var TRAFFIC = _traffic;
}