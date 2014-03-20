Crafty.c('Seek', {
	init: function() {
    var move_speed = 1
	//	target = Crafty('PlayerCharacter')
		this.bind("EnterFrame", function(){
			// moves unit 1 pixel in direction of target
			var xdist = Math.abs((this.target.x - this.x))
			var ydist = Math.abs((this.target.y - this.y))
			this.shift(move_speed*(this.target.x - this.x) / (xdist + ydist), (this.target.y - this.y) / (xdist + ydist), 0, 0);
			//xportion = xdist / (xdist + ydist)
		});
	}
	// variables: function(s) {
	// 	var speed = s	
	// }
});

Crafty.c('Missile', {
	init: function() {
	  this.requires('Actor, spr_cherry, Seek');

		this.bind("EnterFrame", function() {
			var xdist = Math.abs((this.target.x - this.x))
			var ydist = Math.abs((this.target.y - this.y))
			this.shift((this.target.x - this.x) / (xdist + ydist), (this.target.y - this.y) / (xdist + ydist), 0, 0);
			if ((xdist + ydist) < 5) {  // OR NaN
        dead = this.target.takeDamage(this.owner.attack);
    		if (dead) { // fighting unit is killed
      	//	console.log("Death Event Triggered. Dead cherry = " + this[0])
      		Crafty.trigger('Death', this);
    			// Assign gold, score, & xp to this trigger				 
    		}
				this.destroy();
			}
		});
	},
  // targetDied: function(){
  //   this.destroy()
  // },
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
