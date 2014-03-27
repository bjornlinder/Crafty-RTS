// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
	// A 2D array to keep track of all occupied tiles
	this.occupied = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		this.occupied[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			this.occupied[i][y] = false;
		}
	}
 
	// Player character, placed at 5, 5 on our grid
	this.player = Crafty.e('PC').at(10, 5);
  Crafty.e('HealthBar').attr({x:5,y:5});
	this.occupied[this.player.at().x][this.player.at().y] = true;
 
	// Place a tree at every edge square on our grid of 16x16 tiles
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
			if (at_edge) {
				// Place a tree entity at the current tile
				Crafty.e('Tree').at(x, y)
				this.occupied[x][y] = true;
			} 
		}
	}
  
  Crafty.e('Scoreboard');

	creeps_spawned = 0;
	creep_count = 7 + (level * 2);
  spawn_interval = 1000 - (level * 100);
	if (spawn_interval < 500) {
    spawn_interval = 500;
  }
  
 // var ent = Crafty.e("2D, DOM, Image").image("myimage.png");
  
	//Spawn the army of darkness
  if (level == 5 || level == 10) {
		Crafty.audio.play('divadance');
    Crafty.e('Boss').at(3,3).delay(function() {
      creeps_spawned+=1;
  		Crafty.e("Creep").at(this.at().x,this.at().y);
  	},	spawn_interval, creep_count - 1	//will need to update the creep count/clean method.
  	);
  } else {
  	Crafty.e("CandyMountain").at(3,3).delay(function() {
      creeps_spawned+=1;
  		Crafty.e("Creep").at(3,3);
  	},	spawn_interval, creep_count - 1	//will need to update the creep count/clean method.
  	);
  }

	// Generate five villages on the map in random locations
	var max_villages = 5;
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
      
			if (Math.random() < 0.03) {
				if (Crafty('Village').length < max_villages && !this.occupied[x][y]) {
					Crafty.e('Village').at(x, y);
				}
			}
			else if (Math.random() < (0.09 + level * 0.005) && !this.occupied[x][y]) {
				// Place a bush entity at the current tile
				var bush_or_rock = 'Tree'
				Crafty.e(bush_or_rock).at(x, y)
				this.occupied[x][y] = true;
			}
		}
	}
	// Play a ringing sound to indicate the start of the journey
	Crafty.audio.play('ring');

	Crafty.bind('PlayerDeath', function() {
    console.log('Death was triggered. Crafty("PC").length: ' + Crafty('PC').length)
		Crafty.scene('Failure');
	});
  
	Crafty.bind('LevelComplete', function() {
    console.log('All Creeps killed. ' + Crafty('PC').length)
    if (creeps_spawned >= creep_count) {
  		Crafty.scene('Victory');
    }
	});
 
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	//this.unbind('Death', this.show_result);
  this.unbind('LevelComplete', this.show_result);
  this.unbind('PlayerDeath', this.show_result); 
});
 
 
// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene('Victory', function() {
	// Display some text in celebration of the victory
	Crafty.e('2D, DOM, Text')
		.text('You Make a Fruit Smoothie. Level Reached: ' + level + ' Score: ' + score + ' Press any key to continue.' )
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.textFont($text_css);
 
	// Give'em a round of applause!
//	Crafty.audio.play('applause');
 
	// After a short delay, watch for the player to press a key, then restart
	// the game when a key is pressed
	var delay = true;
	setTimeout(function() { delay = false; }, 5000);
	this.restart_game = function() {
		if (!delay) {
      level += 1;
      levelscore = 0;
      gold = 100 + gold * 0.1 + (level * 10);
			Crafty.scene('Game');
		}
	};
	Crafty.bind('KeyDown', this.restart_game);
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	this.unbind('KeyDown', this.restart_game);
});

Crafty.scene('Failure', function() {
	// Display some text in celebration of the victory
	Crafty.e('2D, DOM, Text')
		.text('Your Hero Has Been Slain By Rotten Fruit! Score: ' + score + " Lives remaining: " + lives)
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.textFont($text_css);

	// After a short delay, watch for the player to press a key, then restart
	// the game when a key is pressed
	var delay = true;
	setTimeout(function() { delay = false; }, 5000);
	this.restart_game = function() {
		if (!delay) {
      if (lives <= 0) {
      level = 1;
      score = 0;
      gold = 100;
      } else {
      lives -= 1;
      score = score - levelscore;
      }
      levelscore = 0;
  		Crafty.scene('Game');
		}
	};
	Crafty.bind('KeyDown', this.restart_game);
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	this.unbind('KeyDown', this.restart_game);
});

 
// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
	// Draw some text for the player to see in case the file
	//  takes a noticeable amount of time to load
	Crafty.e('2D, DOM, Text')
		.text('Loading; please wait...')
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.textFont($text_css);
 
	// Load our sprite map image
	Crafty.load([
		'assets/frogs.png',
    'assets/fireball.png',
    'assets/apple.png',
    'assets/chapstick.png',
    'assets/tree2.png',
    'assets/wizard.png',
    'assets/divadance.m4a',
		'assets/door_knock_3x.mp3',
		'assets/door_knock_3x.ogg',
		'assets/door_knock_3x.aac',
    'assets/hadouken.mp3',
		'assets/board_room_applause.mp3',
		'assets/board_room_applause.ogg',
		'assets/board_room_applause.aac',
		'assets/candy_dish_lid.mp3',
		'assets/candy_dish_lid.ogg',
		'assets/candy_dish_lid.aac'
		], function(){
		// Once the images are loaded...
 
		// Define the PC's sprite to be the first sprite in the third row of the
		//  animation sprite map
    // Crafty.sprite(16, 'assets/hunter.png', {
    //   spr_player:  [0, 2],
    // }, 0, 2);
		Crafty.sprite('assets/wizard.png', {wizard:[0,0,42,52]});
		Crafty.sprite('assets/tree2.png', {spr_tree:[0,0,43,41]});
		Crafty.sprite('assets/candymountain.png', {candymountain:[0,0,64,59]});
		Crafty.sprite('assets/chapstick.png', {chapstick:[0,0,52,39]});
		Crafty.sprite('assets/fireball.png', {fireball:[0,0,28,32]});
		Crafty.sprite('assets/apple.png', {apple:[0,0,44,44]});
	//	Crafty.sprite('assets/grass.png', {grass:[0,0,52,52]});
		Crafty.sprite('assets/bossapple.png', {bossapple:[0,0,88,88]});
    
		Crafty.sprite(36, 'assets/frogs.png', {
			spr_frog:  [0, 0]
    });
 
		// Define our sounds for later use
		Crafty.audio.add({
      divadance: ['assets/divadance.m4a'],
      hadouken: ['assets/hadouken.mp3'],
			knock:    ['assets/door_knock_3x.mp3', 'assets/door_knock_3x.ogg', 'assets/door_knock_3x.aac'],
			applause: ['assets/board_room_applause.mp3', 'assets/board_room_applause.ogg', 'assets/board_room_applause.aac'],
			ring:     ['assets/candy_dish_lid.mp3', 'assets/candy_dish_lid.ogg', 'assets/candy_dish_lid.aac']
		});
    score = 0;
    levelscore = 0;
    gold = 100;
    level = 1;
    lives = 3;
    // levels = 2;//next make this infinite
		//wave count incrementing
    // Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 100 }).text('Look at me!! Score: ' + score)
    //    .textColor('#FF0000', 0.6);
 
		// Now that our sprites are ready to draw, start the game
		Crafty.scene('Game');
	});
});