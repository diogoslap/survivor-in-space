$(document).ready(function(){
	var canvas;
	var ctx;
	var best_score = 0;
	var last = false;
	var game_over = false;
	var level_game = 1;
	var load_meteor;
	var turbo_space = false;
	var turbine = "first";
	var stars = [];
	var started = false;
	var speed = "";
	var asteroids = [];
	var asteroidSize = ['small','small2','medium','medium2','big','big2'];
	var meteor;
	var spaceship;
	var game_loop;
	var score = 0;
	var interval_speed;
	var pause_game = true;
	var pause_text,
	width = 500,
	height = 400,
	rightKey = false,
	leftKey = false,
	upKey = false,
	downKey = false,
	ship_x =(width/2) - 25,
	ship_y = height - 55,
	ship_w = 44,
	ship_h = 37,
	srcX = 38,
	srcY = 0,
	speed_spaceship = 7,
	turbo_speed = 2,
	count = 0,
	speed_star = 4;
	var asteroid_x, asteroid_y,asteroid_w,asteroid_h,asteroid_srcx,asteroid_srcy;
	
	function level(){
			level_game++;
			if(speed_star < 6){
				speed_star = speed_star+level_game*0.5;
			}
			if(speed_spaceship <=10){
				speed_spaceship += level_game*0.5;
			}
			
			//asteroids = [];
	}

	function makeAsteroid(){

		var size = Math.floor(Math.random() * 6);
		var x = Math.floor(Math.random() * 498);

		if(asteroidSize[size] == "small"){
			asteroids.push({asteroid_srcx:102,asteroid_srcy:265,asteroid_x:x, asteroid_y:-100,asteroid_w:16,asteroid_h:16})
		}else if(asteroidSize[size] == "small2"){
			asteroids.push({asteroid_srcx:92,asteroid_srcy:313,asteroid_x:x, asteroid_y:-100,asteroid_w:20,asteroid_h:20})
		}else if(asteroidSize[size] == "medium"){
			asteroids.push({asteroid_srcx:62,asteroid_srcy:260,asteroid_x:x, asteroid_y:-100,asteroid_w:30,asteroid_h:29})
		}else if(asteroidSize[size] == "medium2"){
			asteroids.push({asteroid_srcx:58,asteroid_srcy:311,asteroid_x:x, asteroid_y:-100,asteroid_w:20,asteroid_h:26})
		}else if(asteroidSize[size] == "big"){
			asteroids.push({asteroid_srcx:0,asteroid_srcy:242,asteroid_x:x, asteroid_y:-100,asteroid_w:55,asteroid_h:53})
		}else if(asteroidSize[size] == "big2"){
			asteroids.push({asteroid_srcx:0,asteroid_srcy:304,asteroid_x:x, asteroid_y:-100,asteroid_w:51,asteroid_h:42})
		}
		
	}
  	function makeStars(){
  		 // Draw 50 stars.
  		 stars = [];
        for (i = 0; i <= 100; i++) {
          // Get random positions for stars.
          var x = Math.floor(Math.random() * 500);
          var y = Math.floor(Math.random() * 400);
          // Make the stars white
          stars.push({fillStyle:"#EEEEEE",pos_x:x,pos_y:y});

        

            // Draw an individual star.
            //ctx.beginPath();
            //stars.i.circle = ctx.arc(x, y, 3, 0, Math.PI * 2, true);
            //ctx.closePath();
            //ctx.fill();
       
        }
  	}
  	function moveStars(){

  		for (i = 0; i < stars.length; i++) {
  			ctx.fillStyle = stars[i].fillStyle;
	  		ctx.beginPath();	
	        ctx.arc(stars[i].pos_x, stars[i].pos_y, 2, 0, Math.PI * 2, true);
	        ctx.closePath();
	        ctx.fill();
	        stars[i].pos_y = stars[i].pos_y > height ? 0 : stars[i].pos_y+speed_star; 
    	}
  	}

  	function moveAsteroid(){

  		for (i = 0; i < asteroids.length; i++) {
  			
  			ctx.drawImage(meteor, asteroids[i].asteroid_srcx, asteroids[i].asteroid_srcy, asteroids[i].asteroid_w, asteroids[i].asteroid_h,
  			 				asteroids[i].asteroid_x, asteroids[i].asteroid_y, asteroids[i].asteroid_w, asteroids[i].asteroid_h);
	        
	        checkCollide(asteroids[i]);

	        if(asteroids[i].asteroid_y > height){
	        	asteroids[i].asteroid_y = -100;
	        	asteroids[i].asteroid_x = Math.floor(Math.random() * 498);
	        	score++;
	        	if(score%50==0){
	        		level();
	        	}
	        }else{
	        	asteroids[i].asteroid_y = asteroids[i].asteroid_y+speed_star;

	        }
    	}
  	}/*
  	function turbo(isTurbo){
		if(isTurbo && count < 3){
			while(count<3){
				speed_spaceship += turbo_speed;
				speed_star += turbo_speed;
				count++;
			}
		}else if(!isTurbo && count>0){
			while(count>0){
				speed_spaceship -= turbo_speed;
				speed_star -= turbo_speed;
				count--;
			}
		}

	}*/
	function pause(stop_game){
		if(stop_game){
			clearInterval(game_loop);
			clearInterval(load_meteor);
			pause_game = false;
			pause_text = "PAUSE";
			ctx.font="30px Verdana";
			ctx.fillStyle = "#FFEEEE";
			ctx.fillText(pause_text,width*0.5-50,height*0.5-10);
		}else{
			game_loop = setInterval(loop,1000/60);
			loadMeteor();
			pause_game = true;
			pause_text = "";
		}
	}
	function gameover(){
		$(".best").show();
			if(score > best_score){
				best_score = score;
				$(".best-score").html(score);
			}
			$("#pontos").val(score);
			$(".score").html(score);
			clearInterval(game_loop);
			clearInterval(load_meteor);
			game_over = true;
			/*var gameover_text = "GAME OVER";
			ctx.font="30px Verdana";
			ctx.fillStyle = "#FFEEEE";
			ctx.fillText(gameover_text,width*0.5-75,height*0.5-10);*/
			
			
			$("#restart").click(function(){
				/*location.reload();*/
				console.log("Clicou");
				$(".best").hide();
				$(".score").html("0");
				restart();
			});
	}
	function drawShip(){
		//Score
		var score_text = "Score: "+score;
		ctx.font="12px Verdana";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(score_text,5,height-10);
		//Stopped
		if(rightKey == false || leftKey == false){
			ship_w = 40;
			srcX = 38;
		}
		//Right Arrow
		if(rightKey){
			rightMove();
		}
		//Left Arrow
		if(leftKey){
			leftMove();
		}
		//Up arrow
		if(upKey){
			upMove();
		}
		//Down Arrow
		if(downKey){
			downMove();
		}

		if(turbine == "first"){
				turbine = "second";
				srcY = 0;
				ship_h = 37
				//ship_y +=2;
		}else if(turbine == "second"){
				if(last){
					turbine = "first";
					last = false;
				}else{
					turbine = "third"
					//ship_y -=2
				}
				srcY = 85;
				ship_h = 40;
		}else{
			turbine = "second";
			last = true;
			srcY = 40;
			ship_h = 42;
		}

		checkLimit();	
		ctx.drawImage(spaceship, srcX, srcY, ship_w, ship_h, ship_x, ship_y, ship_w, ship_h);
	}

	function checkCollide(asteroid){
			if(!(( ( ship_y + ship_h ) < ( asteroid.asteroid_y ) ) ||
				( ship_y + ship_h/2 > ( asteroid.asteroid_y + asteroid.asteroid_h ) ) ||
				( ( ship_x + ship_w ) < asteroid.asteroid_x ) ||
				( ship_x-5 > ( asteroid.asteroid_x + asteroid.asteroid_w) )
				)){
				gameover();
			}
	}
	function rightMove(){
		ship_x += speed_spaceship;
		srcX = 85;
	}
	function leftMove(){
		ship_x -= speed_spaceship;
		
		srcX = 0;
		ship_w = 37;
		
	}
	function upMove(){
		ship_y -= speed_spaceship;
	}
	function downMove(){
		ship_y += speed_spaceship;
	}

	function checkLimit(){

		if(ship_x > width-35){
			ship_x -= speed_spaceship;
		}
		if(ship_x < 0){
			ship_x += speed_spaceship;
		}
		if(ship_y > height-55){
			ship_y -= speed_spaceship;
		}
		if(ship_y < 0){
			ship_y += speed_spaceship;
		}
	}

	function clearCanvas() {
	  ctx.clearRect(0,0,500,400);
	  ctx.fillStyle = "black";
   	  ctx.rect(0, 0, 500, 400);
      ctx.fill();
	}
	function loop() {
	  clearCanvas();
	  //turbo(turbo_space);
	  moveStars();
	  moveAsteroid();
	  drawShip();
	}
	
	function keyDown(e) {
	  if (e.keyCode == 39) rightKey = true;
	  else if (e.keyCode == 37) leftKey = true;
	  else if (e.keyCode == 40) downKey = true;
	  else if (e.keyCode == 38) upKey = true;
	  //else if(e.keyCode == 32 && !game_over) turbo_space = true;
	  else if(e.keyCode == 82 && !turbo_space && !game_over) restart();
	  else if(e.keyCode == 80 && !game_over) pause(pause_game);
	  else if(e.keyCode == 13 && !game_over && !started) start();
	  
	}
	function keyUp(e) {
	  if (e.keyCode == 39) rightKey = false;
	  else if (e.keyCode == 37) leftKey = false;
	  else if (e.keyCode == 40) downKey = false;
	  else if (e.keyCode == 38) upKey = false;
	  //else if(e.keyCode == 32) turbo_space = false;
	  
	}

	canvas = document.getElementById('gamespace');
		ctx = canvas.getContext('2d');

		meteor = new Image();
		meteor.src = "images/spaceshipsprites.gif";

		makeStars();
		spaceship = new Image();
		spaceship.src = "images/spaceshipsprites.gif";
		
		clearCanvas();

		var start_text = "Press Enter to start the game";
		ctx.font="12px Verdana";
		ctx.fillStyle = "#FFEEEE";
		ctx.fillText(start_text,width*0.5-75,height*0.5-10);

		document.addEventListener('keydown', keyDown, false);
	  	document.addEventListener('keyup', keyUp, false);

  	function loadMeteor(){
  		load_meteor = setInterval(function(){
			if(asteroids.length <= (10*level_game)/2 && asteroids.length <= 15 ){
				makeAsteroid();
			}
		},1000);
  	}

  	function start(){
  		started = true;
		loadMeteor();
		game_loop = setInterval(loop, 1000/60);
  	}

  	function restart(){
  		reset();
  		turbo_space = false;
  		asteroids = [];
  		stars = [];
  		level_game = 1;
  		speed_star = 4;
  		count = 0;
  		speed_spaceship = 7;
  		game_over = false;
  		width = 500;
		height = 400;
		rightKey = false;
		leftKey = false;
		upKey = false;
		downKey = false;
		ship_x =(width/2) - 25;
		ship_y = height - 55;
		ship_w = 44;
		ship_h = 37;
		srcX = 38;
		srcY = 0;
		score = 0;
  		makeStars();
  		loadMeteor();
		game_loop = setInterval(loop, 1000/60);

  	}

  	function reset(){
  		clearInterval(load_meteor);
  		clearInterval(game_loop);
		
  	}

});

