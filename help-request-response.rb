JavaScript objects do have constructors. You can create objects through functions - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor The this keyword is used often to refer to the state and behavior of the current instance. See https://gist.github.com/dpickett/84ea1ad2a7a0dc121a8f for an example of how to define a "class" and invoke its constructor, as well as an example instance method definition. A lot of folks have started to omit semicolons (http://mislav.uniqpath.com/2010/05/semicolons/) - the spec, however, does require that you terminate your statements with a semi-colon, so we teach that you should adhere to the spec. You can't define global variables inside other objects. You can assign global variables that exist for the life of the page through the window or document global objects when dealing with the document object model.


	// scoreboard = Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 15 }).text('Look at me!! Score: ' + score)
//      .textColor('#ffffff', 1.6);
  //   https://groups.google.com/forum/#!topic/craftyjs/wO-0cYN8Dy4
     // bind to death events
     //Score boards
     // Crafty.e("LeftPoints, DOM, 2D, Text")
     //   .attr({ x: 20, y: 20, w: 100, h: 20, points: 0 })
     //   .text("0 Points");
     
 	//CREATE PATH FOR MINONS OF DARKNESS
  // for (var x = 0; x < Game.map_grid.width; x++) {
  //   this.occupied[x][3] = true;
  // }
	
  <!-- <audio controls autoplay>
    <source src="assets/InkSpots_Melody_of_Love.mp3" type="audio/mpeg">
    <source src="/the-way-you-look-tonight.mp3" type="audio/mpeg">
    Your browser does not support Ol' Blue Eyes.
  </audio> -->
 