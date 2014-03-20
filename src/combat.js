
//have health, can attack, can die (dmg can be 0!)
Crafty.c('Fights', {
	init: function() {
		this.attack = 10;
		this.charging = false;
  	this.bind("EnterFrame", function(){
  		if (this.charging==false) {
  			this.nearestEnemy(); //var target = 
  		}
		});
	},
  
  enemies: function() {
		if (this.has('GoodGuy')) {
			return Crafty('Creep');
    } else {
			return Crafty('PC');
    }
  },
	
	nearestEnemy: function() {
    var enemies = this.enemies();
    this.min_dist = 9999;
  //  console.log("In nearestEnemy. Distance:" + this.min_dist + "; attacker: " + this[0])
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
		if (this.min_dist < 35) {	// unit range
			this.autoAttack(target);
      //if enemy destroyed, reset min distance
		}
	//	return _target;
		//should returns nearest enemy's distance and enemy itself...or at least enemy position. maybe just do the attack in this method...hmmm...yea...
		//index,enemyDistances.min()];
	},
	
	autoAttack: function(target) {
		//console.log('team:' + this.team)
		console.log("attacking unit" + target[0] + "; attacker: " + this[0])	
    Crafty.e('Missile').targetting(target,this).at(this.at().x,this.at().y);
		//dead = this.enemy[index].takeDamage(this.attack);	
    // if (dead) {
    //   deadZed = this.enemy.splice(index,1);    
    //   // Assign gold, score, & xp here         
    // }
		this.charging = true							
	 	this.timeout(function() {
			this.charging = false 		
	 	}, 1000);	// reload speed. 1000 = 1 second.
	},
	
	takeDamage: function(damage) {
		console.log("Taking damage. Starting health:" + this.health + "Unit Id:" + this[0])
		this.health -= damage;
		if (this.health <= 0) {
      this.destroy();
		//	Crafty.trigger("unit_killed",'experience')
			return true	;	//remove self from team array
		}
		//Crafty.addEvent(player, Crafty.stage.elem, "mousedown", player.onMouseDown);
		//alerts other object to damage; that entity checks if destroyed
	}
});
