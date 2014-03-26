Crafty.c('HealthBar', {
	init: function() {
		this.requires('Actor, Color');
    this.color('rgb(255,0,0)') 
    this.h = 5;
        
		this.bind("EnterFrame", function(){      
      var barLength = (Crafty('PC').health / Crafty('PC').maxHealth);
      this.w = 40 * barLength;
      this.at(Crafty('PC').at().x, Crafty('PC').at().y - 0.5);
    });
  },
  
	at: function(x, y) {
		if (x === undefined && y === undefined) {
			return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height };
		} else {
			this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
			return this;
		}
	}
  
});

Crafty.c('Scoreboard', {
	init: function() {
    this.requires("2D, Canvas, Text")
        .attr({ x: 100, y: 50 })
     //   .text('Look at me!! Score: ' + score)
        .textColor('#ffffff', 3);
		this.bind("EnterFrame", function(){
      this.text('Level: ' + level + ' Score: ' + score + " Gold: " + gold);
    });
  }
});