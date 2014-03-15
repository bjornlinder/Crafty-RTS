
//have health, can attack, can die (dmg can be 0!)
Crafty.c('Fights', {
	init: function() {
		this.bind("EnterFrame", function(){
			if (this.charging==false) {
				this.autoAttack(); // (this.team)
			}
		});
		this.attack = 10;
		this.charging = false;
		if (this.has('GoodGuy')) {
			this.enemy = teamB	
			this.team = 'teamA';
		} else {
			this.enemy = teamA;
			this.team = 'teamB';
		}	
	},
	autoAttack: function() {
		for (index = 0; index < this.enemy.length; ++index) {				
			//console.log('team:' + this.team)
			dist = Crafty.math.distance(this.x,this.y,this.enemy[index].x,this.enemy[index].y)	//check distance to player characters
			if (dist < 35) {	//check for lowest distance
				console.log("attacking unit" + index + "; attacker: " + this.team)
				dead = this.enemy[index].takeDamage(this.attack);	
				if (dead) {
					deadZed = this.enemy.splice(index,1);						 
				}
				this.charging = true							
			 	this.timeout(function() {
					this.charging = false 		
			 	}, 1000);	// reload speed. 1000 = 1 second.
			}
		}
	},
	takeDamage: function(damage) {
		console.log("Taking damage. Starting health:" + this.health)
		this.health -= damage;
		//console.log("damaging unit" + index + "health:" + this.health)
		if (this.health <= 0) {
			console.log("destroying unit" + index)
			Crafty.trigger("unit_killed",'experience')
			this.destroy();
			return true	;	//remove self from team array
		}
		//Crafty.addEvent(player, Crafty.stage.elem, "mousedown", player.onMouseDown);
		//alerts other object to damage; that entity checks if destroyed
	}
});

