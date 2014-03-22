Crafty.c('HealthBar', {
	init: function() {
		this.requires('Actor, Color');
    this.color('rgb(255,0,0)') 
    this.h = 3;
		this.bind("EnterFrame", function(){
      var barLength = (Crafty(2).health / Crafty(2).maxHealth);
      this.w = 20 * barLength;
      this.at(Crafty(2).at().x, Crafty(2).at().y - 0.5);
    });
  }
});

Crafty.c('Scoreboard', {
	init: function() {
    score = 0;
    this.requires("2D, Canvas, Text")
        .attr({ x: 100, y: 15 })
     //   .text('Look at me!! Score: ' + score)
        .textColor('#ffffff', 1.6);
		this.bind("EnterFrame", function(){
      this.text('Look at me!! Score: ' + score);
    });
  }
});