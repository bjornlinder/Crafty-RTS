Crafty.c('Seek', {
	init: function() {
    this.move_speed = 2
		this.bind("EnterFrame", function(){
			// moves unit 1 pixel in direction of target
			var xdist = Math.abs((this.target.x - this.x))
			var ydist = Math.abs((this.target.y - this.y))
			this.shift(this.move_speed*(this.target.x - this.x) / (xdist + ydist), (this.target.y - this.y) / (xdist + ydist), 0, 0);
		});
	}

});

Crafty.c('Missile', {
	init: function() {
	  this.requires('Actor, fireball');
    this.movespeed = 4;
		this.bind("EnterFrame", function() {
      
			var xdist = Math.abs((this.target.x - this.x))
			var ydist = Math.abs((this.target.y - this.y))
			this.shift(this.movespeed*(this.target.x - this.x) / (xdist + ydist), (this.target.y - this.y) / (xdist + ydist), 0, 0);
			if ((xdist + ydist) < 5) {  // OR NaN
        dead = this.target.takeDamage(this.owner.attack);
    		if (dead) { // fighting unit is killed
        console.log('Death about to be triggered. Crafty("PC").length: ' + Crafty('PC').length + ";  Missile id: " + this[0]);
          score += 10;
    		}
        console.log('Missile about to be destoryed. Owner: ' + this.owner[0] );
				this.destroy();        
			}
		});
	},

	targetting: function(target, owner) {
		this.target = target;
    this.owner = owner;
   return this
	}
});

// Linear movement:
// this.bind("EnterFrame", function(){
// 	this.move('e',1)	//direction & speed
// });
