var colors = function(){
	return {
		names: ['red','blue','teal','purple','yellow','orange','green','pink','lightblue','darkgreen','grey','brown'],
		colors: ['f5003f','362dfe', '4ce7c2','560092','f7fa40','f78c43','3dc229','e055bc','87baed','226261','9796a6','502b2c'],
		available: [],

		init: function(){
			var me = this;

			for(var k in this.names){
				if(this.names.hasOwnProperty(k)){
					this.available.push(true);
				}
			}

			me.getAvailableColor = me._getAvailableColor.bind(me);
			me.freeColor = me._freeColor.bind(me);
			me.getIndex = me._getIndex.bind(me);
		},

		_getAvailableColor: function(){
			for(var s = 0; s < this.available.length; s++){
				if(this.available[s] == true){
					this.available[s] = false;
					return {
						name: this.names[s],
						value: this.colors[s]
					}
				}
			}
		},

		_freeColor: function(name){
			this.available[this.getIndex(name)] = true;
		},

		_getIndex: function(name){
			for(var s = 0; s < this.names.length; s++){
				if(this.names[s] == name){
					return s;
				}
			}

			return false;
		}
	}
}();

colors.init();

if(module){
	module.exports = colors;
}