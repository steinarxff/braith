/*

    Terminal

    Used to draw ncurses-like windows with stats in the terminal.

    -really- cool stuff this ncurses stuff. Makes you feel like 1990 all over again!

    Status: Holy shitballs of crazy.

 */


var NCURSES = require("ncurses");

var terminal = function() {
    var p_STARTCOL = 1,
        p_BOTTOM = 10;

    var configs = {
        objects: {
            size: {
                height: 7,
                width: 20
            },
            position: {
                x: 7,
                y: 1
            }
        },
        timer: {
            size: {
                height: 5,
                width: 21
            },
            position: {
                x: 1,
                y: 20
            }
        },
        traffic: {
            size: {
                height: 5,
                width: 17
            },
            position: {
                x: 1,
                y: 1
            }
        }
    };

    return {
        baseWin: new NCURSES.Window(),
        trafficWindow: false,


        init: function(){
            process.on('exit', function(){
                NCURSES.cleanup();
            });

            NCURSES.showCursor = false;

            this.writeStatus = this._writeStatus.bind(this);
            this.traffic = this._traffic.bind(this);
            this.refresh = this._refresh.bind(this);
            this.timer = this._timer.bind(this);
            this.objects = this._objects.bind(this);
        },

        _refresh: function(){
            this.baseWin.refresh();
        },

        _writeStatus: function(type, msg){
            var pos = p_BOTTOM,
                total = "";

            switch(type)
            {
                case "timer":
                    this.timer(msg);
                    break;

                case "objects":
                    this.objects(msg);
                    break;

                case "traffic":
                    this.traffic(msg);
                    break;

                case "log":
                    pos = 4; total = "Log: " + msg;
                    break;

                case "rss":
                    pos = 5; total = "Rss: " + this.toKB(msg) + " KB";
                    break;

                case "heapTotal":
                    pos = 6; total = "Heap total: " + this.toKB(msg) + " KB";
                    break;

                case "heapUsed":
                    pos = 7; total = "Heap used: " + this.toKB(msg) + " KB";
                    break;
            }

            //this.write(pos, total);
            //this.clrtoeol();
            //this.win.cursor(0, 0);
        },

        _objects: function(t){
            if(!this.objectsWindow){
                this.objectsWindow = this.newWindow(configs.objects);
            }

            this.startUpdate(this.objectsWindow);

            this.objectsWindow.addstr(1,2, "Players: " + t.players);
            this.objectsWindow.addstr(2,2, "Passive: " + t.passive);

            this.endUpdate(this.objectsWindow, "Objects");
        },

        _timer: function(t){
            t = t.getValues();
            if(!this.timerWindow){
                this.timerWindow = this.newWindow(configs.timer);
                //this.timerWindow.moveTo(12, 1);
                //this.timerWindow.resize(5,10);

            }

            this.startUpdate(this.timerWindow);

            this.timerWindow.addstr(1, 2, t.last);
            this.timerWindow.addstr(1, 8, ":1");
            this.timerWindow.addstr(2, 2, t.last50);
            this.timerWindow.addstr(2, 8, ":50");
            this.timerWindow.addstr(3, 2, t.last1000);
            this.timerWindow.addstr(3, 8, ":1000");

            this.endUpdate(this.timerWindow, "Timers");
        },

        _traffic: function(t){
            if(!this.trafficWindow){
                this.trafficWindow = this.newWindow(configs.traffic);
            }

            this.startUpdate(this.trafficWindow);

            this.trafficWindow.addstr(1, 2, t.readable.average);
            this.trafficWindow.addstr(2, 2, t.readable.total);
            this.trafficWindow.addstr(3, 2, t.readable.packets);

            this.endUpdate(this.trafficWindow, "Network");
        },

        startUpdate: function(w){
            w.cursor(1,1);
            w.clrtobot();
        },

        endUpdate: function(w, f){
            w.frame(f);
            w.refresh();
        },

        newWindow: function(conf){
            return new NCURSES.Window(conf.size.height,conf.size.width,conf.position.x,conf.position.y);
        },


        write: function(row, msg){
            this.baseWin.addstr(row, p_STARTCOL, msg);
            this.baseWin.clrtoeol();
        },

        toKB: function(val){
            return (val / (1024^2));
        }
    }
}();

terminal.init();

module.exports = terminal;
