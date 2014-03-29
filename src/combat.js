
//have health, can attack, can die (dmg can be 0)
Crafty.c('Fights', {
	init: function() {
		this.attack = 10;
		this.charging = false;
  	this.bind("EnterFrame", function(){
  		if (this.charging == false) {
  			this.nearestEnemy(); //var target = 
  		}
		});
	},
  
  enemies: function() {
		if (this.has('GoodGuy')) {
			return Crafty('BadGuy');
    } else {
			return Crafty('GoodGuy');
    }
  },
	
	nearestEnemy: function() {
    var enemies = this.enemies();
    this.min_dist = 9999;
    if (this.enemies.length = 0){
      return;
    }
    
		for (index = 0; index < enemies.length; ++index) {				
      var enemy = Crafty(enemies[index]);
			var distance = Crafty.math.distance(this.x,this.y,enemy.x,enemy.y);
			if (distance < this.min_dist) {
				this.min_dist = distance;
				var target = enemy; 
			} 
		}
		if (this.min_dist < this.range) {	// unit range
			this.autoAttack(target);
		}
	},
	
	autoAttack: function(target) {
		console.log("attacking unit" + target[0] + "; attacker: " + this[0])	
    Crafty.e('Missile').targetting(target,this).at(this.at().x,this.at().y);
    if (this.has('PC')) {
  		Crafty.audio.play('hadouken');
    }
		this.charging = true							
	 	this.timeout(function() {
			this.charging = false 		
	 	}, 1000);	// reload speed. 1000 = 1 second.
	},
	
	takeDamage: function(damage) {
		console.log("Taking damage. Starting health: " + this.health + "; Unit Id: " + this[0])
		this.health -= damage;
		if (this.health <= 0) {
      console.log("Unit about to be destroyed. Unit Id: " + this[0])
      this.destroy();
      if (Crafty('PC').length == 0) {
    		Crafty.trigger('PlayerDeath');
      } else if (Crafty('BadGuy').length == 0) {
        Crafty.trigger('LevelComplete');
      } 
      console.log("Destroyed " + this[0])
      score+=20;
      levelscore+=20;
      gold+=10;
			return true;
		}
	}
});
