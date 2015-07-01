/*

    Work in progress

 */


var main = function () {
    return {
        sockjs: false,
        lastShot: 0,
        objects: [],
        lookup: [],

        init: function () {
            var me = this;
            render.init();
            me.sockjs = new SockJS('http://10.0.1.86:9999/game');

            me.sockjs.onopen = function () {
                me.sockjs.send('hello');
            };

            me.sockjs.onmessage = me.onMessage.bind(me);
            me.sockjs.onclose = me.onClose.bind(me);
            keyboard(me.sockjs);
            me.setupShot();
        },

        setupShot: function () {
            var me = this;

            render.stage.on('mousedown', function (event) {
                if (((new Date()).getTime() - me.lastShot) > 100) {
                    var pos = event.data.getLocalPosition(render.stage);
                    me.sockjs.send('+shot:' + (pos.x - (RULES.SCREEN_WIDTH / 2)) + ":" + (pos.y - (RULES.SCREEN_HEIGHT / 2)));
                    me.lastShot = (new Date()).getTime();
                }
            });
        },

        onClose: function () {

        },

        onMessage: function (e) {
            var obj = JSON.parse(e.data);

            switch (obj.type) {
                case "wake":
                    render.setSepia(0);
                    break;
                case "hit":
                    render.setSepia(1);
                    break;
                case "score":
                    this.log('<div class="circle" style="background-color: #' + obj.data.shooter + ';"></div> <span style="float: left; padding: 0 5px 0 3px;"> < </span> <div class="circle" style="background-color: #' + obj.data.target + ';"></div>');
                    break;
                case "stats":
                    this.updateScore(obj.data);
                    break;
                case "state":
                    var k;

                    for (var s = 0; s < obj.data.length; s++) {
                        k = this.lookup[obj.data[s].id];
                        k.read.call(k, obj.data[s]);

                        if (k.self) {
                            this.selfProcess(k);
                        }
                    };
                    break;

                case "+self":
                    obj.data.self = true;
                case "+object":
                    var player = this.addObject(obj.data);
                    break;
                case "-object":
                    var k = this.lookup[obj.data.id];
                    k.read.call(k,obj.data);
                    break;
            }
        },

        addObject: function (conf) {
            var obj;

            if (conf.type == "player") {
                obj = new Player(conf);
                this.tag(' has joined', String("#" + obj.color.value));
            }
            if (conf.type == "shot") {
                obj = new Shot(conf);
            }

            this.objects.push(obj);
            this.lookup[obj.id] = obj;
            render.addObject.call(render, obj.get.call(obj));
            return obj;
        },

        selfProcess: function (obj) {
            document.getElementById('progress').value = obj.fuel;
            document.getElementById('shots').innerHTML = obj.shots;
        },

        updateScore: function(arr){
            var t = "";

            for(var s = 0; s < arr.length; s++){
                t += '<div class="circle big" style="background-color: #' + arr[s].color + ';"></div><div class="score">' + arr[s].score + '</div><br>';
            }

            document.getElementById('stats').innerHTML = t;
        },

        tag: function (t, c) {
            this.log('<div class="circle" style="background-color: ' + c + ';"></div>' + t);
        },

        log: function (t) {
            document.getElementById('log').innerHTML = t + "<br>" + document.getElementById('log').innerHTML;
        }
    }
}();