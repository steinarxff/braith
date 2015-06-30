var render = function(){
    return {
        renderer: false,
        manager: false,
        border: false,
        stage: false,
        dot: false,

        init: function(){
            this.renderer = PIXI.autoDetectRenderer(
                RULES.SCREEN_WIDTH, RULES.SCREEN_HEIGHT,
                {
                    antialias: true,
                    transparent: false,
                    resolution: 1
                }
            );

            this.manager = new PIXI.interaction.InteractionManager(this.renderer);

            document.getElementById('canvasWrapper').appendChild(this.renderer.view);
            // Oh, HTML5
            document.getElementById('progress').style.background = "transparent";

            this.drawStage();
            
            this.animate = this._animate.bind(this);

            this.animate();
        },

        setSepia: function(v){
            this.stage.filters[0].sepia = v;
        },

        drawStage: function(){
            var me = this;

            me.stage = new PIXI.Container();
            me.stage.interactive = true;
            
            me.border = new PIXI.Graphics();
            me.border.beginFill(0xffffff);
            me.border.lineStyle(4, 0x000000, 1);
            me.border.drawRect(0,0,RULES.SCREEN_WIDTH,RULES.SCREEN_HEIGHT);
            me.border.endFill();
            me.addObject(me.border);
            me.dot = new PIXI.Graphics();
            me.dot.beginFill(0x000000);
            me.dot.drawCircle(RULES.SCREEN_WIDTH/2, RULES.SCREEN_HEIGHT/2, RULES.DOT_SIZE);
            me.dot.endFill();
            me.addObject(me.dot);

            me.stage.on('mousemove', function(event){
                me.dot.position = event.data.getLocalPosition(me.stage);
                me.dot.position.x -= RULES.SCREEN_WIDTH/2;
                me.dot.position.y -= RULES.SCREEN_HEIGHT/2;
            })

            me.stage.filters = [new PIXI.filters.SepiaFilter()];
            me.stage.filters[0].sepia = 0;
        },

        _animate: function(){
            this.renderer.render(this.stage);
            requestAnimationFrame(this.animate);           
        },

        removeObject: function(obj){
            this.stage.removeChild(obj);
        },

        addObject: function(obj){
            this.stage.addChild(obj);
        }
    }
}();