// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
	init: function() {
		this.attr({
			w: Game.map_grid.tile.width,
			h: Game.map_grid.tile.height
		});
	},
 
	// Locate this entity at the given position on the grid
	at: function(x, y) {
		if (x === undefined && y === undefined) {
			return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height };
		} else {
			this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
			return this;
		}
	}
});
 
// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
	},
});

//Player team
Crafty.c('GoodGuy', {
	init: function() {
		this.requires('Fights');    
	}
});

Crafty.c('HellishPortal', {
  init: function() {
    this.requires('Delay, Actor');
  },
});

Crafty.c('CandyMountain', {
  init: function() {
    this.requires('HellishPortal, candymountain');
  },
});

Crafty.c('BadGuy', {
	init: function() {
		this.requires('Actor, Delay, Fights, Seek')
    this.target = Crafty('PC')
	},
});

Crafty.c('Creep', {
	init: function() {
		this.requires('apple, BadGuy')
		this.health = 10;
    this.movespeed = 1.2 + (level * 0.17);
    if (level == 4 || level == 8) {
      this.movespeed = this.movespeed * 1.45 * Math.random();
    }
	},
});

Crafty.c('Boss', {
  init: function() {
    this.requires('HellishPortal, BadGuy, bossapple');
    this.health = 40;
    this.movespeed = 0.5;
  },
});

Crafty.c('grass', {
  init: function() {
    this.requires('grass, Actor');
  },
});

Crafty.c('Tower', {
	init: function() {
		this.requires('GoodGuy, spr_frog, Actor');
		this.maxHealth = 40;
    this.health = this.maxHealth;
    this.at(Crafty('PC').at().x, Crafty('PC').at().y);
	}
});

// A Tree is just an Actor with a certain sprite
Crafty.c('Tree', {
	init: function() {
		this.requires('Actor, Solid, spr_tree');
	},
});
 
// This is the player-controlled character
Crafty.c('PC', {
	init: function() {
		this.requires('Actor, Fourway, Collision, wizard, SpriteAnimation, GoodGuy')
			.fourway(3.4+level*0.4)
			.stopOnSolids()
			.onHit('Village', this.visitVillage)
			.reel('PlayerMovingUp',    600, 0, 0, 3)
			.reel('PlayerMovingRight', 600, 0, 1, 3)
			.reel('PlayerMovingDown',  600, 0, 2, 3)
			.reel('PlayerMovingLeft',  600, 0, 3, 3);
 
		// Watch for a change of direction and switch animations accordingly
		var animation_speed = 4;
		this.maxHealth = 136 + (level * 8);
    this.health = this.maxHealth;
    
    this.bind('KeyDown', function(key) {
      if (key.key === Crafty.keys.T) {
        if (gold >=100) {
          Crafty.e('Tower');
          gold-=100
          console.log("Keydown success. activated.");
        } 
      }
    });
    
		this.bind('NewDirection', function(data) {
			if (data.x > 0) {
				this.animate('PlayerMovingRight', -1);
			} else if (data.x < 0) {
				this.animate('PlayerMovingLeft', -1);
			} else if (data.y > 0) {
				this.animate('PlayerMovingDown', -1);
			} else if (data.y < 0) {
				this.animate('PlayerMovingUp', -1);
			} else {
				this.pauseAnimation();
			}
		});
	},
 
	// Registers a stop-movement function to be called when
	//  this entity hits an entity with the "Solid" component
	stopOnSolids: function() {
		this.onHit('Solid', this.stopMovement);
		return this;
	},
 
	// Stops the movement
	stopMovement: function() {
		this._speed = 0;
		if (this._movement) {
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
	},
 
	// Respond to this player visiting a village
	visitVillage: function(data) {
		villlage = data[0].obj;
		villlage.visit();
	}

});
 
// A village is a tile on the grid that the PC must visit in order to win the game
Crafty.c('Village', {
	init: function() {
		this.requires('Actor, chapstick');
	},
 
	// Process a visitation with this village
	visit: function() {
		this.destroy();
    Crafty('PC').health += 15;
    score += 8;
		Crafty.audio.play('knock');
		Crafty.trigger('VillageVisited', this);
	}
});