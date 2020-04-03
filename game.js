let canvas;
let canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;
let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 3;

let showingWinScreen = false;
let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_THICKNESS = 10;  //Some people name const variables all caps
const PADDLE_HEIGHT = 100;

function calculateMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

function handleMouseClick(){
    if(showingWinScreen){
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false
    }
}


window.onload = function() {
    console.log("Hola Mundo!");
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    let framesPerSecond = 30;
    setInterval(function(){
                moveEverything();
                drawEverything();}, 
                1000/framesPerSecond);

canvas.addEventListener('mousedown',handleMouseClick)
canvas.addEventListener('mousemove',function(evt) {
        let mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
});

WebFont.load({
    google: {
        //families: ['Droid Sans', 'Droid Serif']
        families: ['Orbitron']
    }
});
}


// Audio Related
function PlaySoundGameOver() {
    var audio = new Audio('sounds/PongGaveOverSoundEffect.mp3');
    audio.loop = false;
    audio.play(); 
}

function PlaySoundWallBounce() {
    var audio = new Audio('sounds/PongWallSoundEffect.mp3');
    audio.loop = false;
    audio.play(); 
}

function PlaySoundPaddleBounce() {
    var audio = new Audio('sounds/PongPaddleSoundEffect.mp3');
    audio.loop = false;
    audio.play(); 
}

function PlaySoundScore() {
    var audio = new Audio('sounds/PongScoreSoundEffect.mp3');
    audio.loop = false;
    audio.play(); 
}

// Ball Reset
function ballReset(){
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
        showingWinScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function computerMovement() {
    let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    if(paddle2YCenter < ballY - 35){ //original was 35    //Ignore chasing the ball wihle it's within 25 pixels above or below the paddle center position (70 pixel span) 
        paddle2Y += 6;  //original was 6
    } else if (paddle2YCenter > ballY + 35) { //original was 35
        paddle2Y -= 6;
    }
}

function moveEverything(){
    if (showingWinScreen) {
        return;
    }

    computerMovement();

    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;

    if(ballX < 0) {
        if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){  //if the ball is below or above the paddle
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
            PlaySoundPaddleBounce()
        } else {
            player2Score++; //must be before ballReset()
            if(player2Score === WINNING_SCORE){
                PlaySoundGameOver()
            } else {
                PlaySoundScore()
            }
            ballReset();
        }
    }
    if(ballX > canvas.width){
        if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT){  //if the ball is below or above the paddle
            ballSpeedX = -ballSpeedX
            let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
            PlaySoundPaddleBounce()
        } else {
            player1Score++; //must be before ballReset()
            if(player1Score === WINNING_SCORE){
                PlaySoundGameOver()
            } else {
                PlaySoundScore()
            }
            ballReset();
        }
    }
    if(ballY < 0){
        PlaySoundWallBounce()
        ballSpeedY = -ballSpeedY;
    }
    if(ballY > canvas.height){
        PlaySoundWallBounce()
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet(){
    for(let i = 0; i < canvas.height; i+=40){
        colorRect(canvas.width/2-1,i,2,20,'white');
    }
}

function drawEverything(){
    //next line blanks out the screen with black
    colorRect(0,0,canvas.width,canvas.height,'black');

    canvasContext.font = "50px 'Orbitron'"
    canvasContext.fillStyle = 'white';

    if(showingWinScreen){
        if(player1Score >= WINNING_SCORE){
            canvasContext.fillText("Player 1 Wins!",250,200);
        } else if (player2Score >= WINNING_SCORE){
            canvasContext.fillText("Computer Wins!",250,200);
        }

        canvasContext.fillText("click to play again",350,500);
        return;
    }

    drawNet();
    // this is left player paddle
    colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

    // this is right computer  paddle
    colorRect(canvas.width - PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
    
    // next line draws the ball
    colorCircle(ballX, ballY, 10, 'white');

    //Add Score text
    canvasContext.fillText(player1Score, 100,100); //is gonna display "score stuff" at position 100,100
    canvasContext.fillText(player2Score, canvas.width-100,100);
}

function colorCircle(centerX, centerY, radius, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true)  // X position, Yposition (center of the circle) , radius (size of the ball), radians circle (Math.PI ishalf circle and * 2 is full circle, clockwise or counterclockwise)
    canvasContext.fill();
}

function colorRect(leftX,topY,width,height,drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX,topY,width,height,drawColor);
}
