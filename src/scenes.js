// Game scene
// -------------
Crafty.scene('Game', function() {
  Crafty.background('url(assets/unicorn.jpg)');
  
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
 
	// Place a tree at every edge square on grid
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
  goldspent = 0;
  levelscore = 0;
  
	creeps_spawned = 0;
	creep_count = 7 + (level * 2);
  spawn_interval = 1000 - (level * 100);
	if (spawn_interval < 500) {
    spawn_interval = 500;
  }
  
  if (level == 3 || level == 8 || level == 11) {
		Crafty.audio.play('divadance');
    Crafty.e('Boss').at(3,3).delay(function() {
      creeps_spawned+=1;
      creep_count-=1;
  		Crafty.e("Creep").at(this.at().x,this.at().y);
  	},	spawn_interval, creep_count - 2	
  	);
  } else if (level == 4 || level == 6 || level == 12) {
    creep_count = level*2
    Crafty.e('HellishPortal').at(0,1).delay(function() {
      creeps_spawned+=1;
  		Crafty.e("Cthullu").at(this.at().x,Math.floor(9*Math.random()*this.at().y));
  	},	1700, level*2.5
  	);
  } else if (level == 5 || level == 10 || level == 15) {
  	creep_count = (2 + level/5)*(4 + level/5); //27. should be 24 at lvl 9. 4 boss * 6. 5 boss * 7
    Crafty.e('CandyMountain').at(3,3).delay(function() {
      creeps_spawned+=1;
      Crafty.e("Boss").at(this.at().x,this.at().y).delay(function() {
        creeps_spawned+=1;
    		Crafty.e("Creep").at(this.at().x,this.at().y);
      },   spawn_interval, 2 + level/5 
      );
    }, 5000, 1 + level/5
    );  
  } else {
  	Crafty.e("CandyMountain").at(3,3).delay(function() {
      creeps_spawned+=1;
  		Crafty.e("Creep").at(3,3);
  	},	spawn_interval, creep_count - 1
  	);
  }
  
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
      
			if (!this.occupied[x][y] && Math.random() < 0.03) {
					Crafty.e('Chapstick').at(x, y);
			}
			else if (Math.random() < (0.09 + level * 0.004) && !this.occupied[x][y]) {
				var bush_or_rock = 'Tree'
				Crafty.e(bush_or_rock).at(x, y)
				this.occupied[x][y] = true;
			}
		}
	}
	// Play a ringing sound to indicate the start of the journey
	Crafty.audio.play('ring');

	Crafty.bind('PlayerDeath', function() {
  //  console.log('Death was triggered. Crafty("PC").length: ' + Crafty('PC').length)
		Crafty.scene('Failure');
	});
  
	Crafty.bind('LevelComplete', function() {
  //  console.log('All Creeps killed. ' + Crafty('PC').length)
    if (creeps_spawned >= creep_count) {
  		Crafty.scene('Victory');
    }
	});
 
}, function() {

  this.unbind('LevelComplete', this.show_result);
  this.unbind('PlayerDeath', this.show_result); 
});
 
// end of level scenes
Crafty.scene('Victory', function() {
	message = Crafty.e('2D, DOM, Text')
		.text('You Make a Fruit Smoothie. Level Reached: ' + level + ' Score: ' + score + ' Press any key to continue.' )
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.textFont($text_css);
	Crafty.background('url(assets/rainbowland.jpg)');
  if (level == 3 || level == 5 || level == 11) {
    message.text('Beware the range of Cthullu. He will be destroyed automatically after crossing the screen. Level Reached: ' + level + ' Score: ' + score + ' Press any key to continue.');
  }

	Crafty.audio.play('applause');
 
	var delay = true;
	setTimeout(function() { delay = false; }, 3000);
	this.restart_game = function() {
		if (!delay) {
      level += 1;
      gold = 90 + Math.floor(gold * 0.1) + (level * 10);
			Crafty.scene('Game');
		}
	};
	Crafty.bind('KeyDown', this.restart_game);
}, function() {
	this.unbind('KeyDown', this.restart_game);
});

Crafty.scene('Failure', function() {
	//Crafty.background('url(assets/froggy.jpg)');
	Crafty.background('url(assets/applesauce.gif)');

	Crafty.e('2D, DOM, Text')
		.text("Your Hero Has Been Slain By Rotten Fruit! Level reached: " + level + "; Score: " + score + "; Lives remaining: " + String(lives-1))
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.textFont($text_css)
    .textColor('#FF0000');

	var delay = true;
	setTimeout(function() { delay = false; }, 3000);
	this.restart_game = function() {
		if (!delay) {
      if (lives <= 0) {
      level = 1;
      score = 0;
      gold = 100;
      lives = 6;
      } else {
      lives -= 1;
      gold += goldspent;
      score = score - levelscore;
      }
  		Crafty.scene('Game');
		}
	};
	Crafty.bind('KeyDown', this.restart_game);
}, function() {
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
    'assets/rainbowland.jpg',
    'assets/fireball.png',
    'assets/unicorn.jpg',
    'assets/apple.png',
    'assets/cthullu.png',
    'assets/applesauce.gif',
    'assets/chapstick.png',
    'assets/candymountain.png',
    'assets/bossapple.png',
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

		Crafty.sprite('assets/wizard.png', {wizard:[0,0,42,52]});
		Crafty.sprite('assets/tree2.png', {spr_tree:[0,0,43,41]});
		Crafty.sprite('assets/candymountain.png', {candymountain:[0,0,64,59]});
		Crafty.sprite('assets/chapstick.png', {chapstick:[0,0,52,39]});
		Crafty.sprite('assets/fireball.png', {fireball:[0,0,28,32]});
		Crafty.sprite('assets/apple.png', {apple:[0,0,44,44]});
		Crafty.sprite('assets/bossapple.png', {bossapple:[0,0,88,88]});
		Crafty.sprite('assets/cthullu.png', {cthullu:[0,0,140,137]});
    
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
    lives = 6;

		Crafty.scene('Game');
	});
});