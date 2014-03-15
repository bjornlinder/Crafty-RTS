Crafty.c('Seek', {
	init: function() {
		this.bind("EnterFrame", function(){
			// moves unit 1 pixel in direction of target
			this.xdist = Math.abs((teamA[0].x - this.x))
			this.ydist = Math.abs((teamA[0].y - this.y))
			this.shift((teamA[0].x - this.x) / (this.xdist + this.ydist), (teamA[0].y - this.y) / (this.xdist + this.ydist), 0, 0);
			//xportion = xdist / (xdist + ydist)
		});
	}
});

// this.bind("EnterFrame", function(){
// 	this.move('e',1)	//direction & speed
// });