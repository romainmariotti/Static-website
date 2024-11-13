//Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);


const background_image = new Image();
background_image.src = "../Game/Images/sky.png";

game_started = false;



//Draws the background image
function drawBackground(){
    ctx.drawImage(background_image, 0, 0, canvas.width, canvas.height);
}

//Starts the game
let startGame= function(){
    document.getElementById("start-screen").style.display = "none";
    game_started = true;
    drawBackground();
    CallMeteor();
    animateMeteors();
    pauseButton();
}




//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//Meteors
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------

let meteors_array = [];//Array to manage multiple meteors at the same time
const meteorImage = new Image();
meteorImage.src = "../Game/Images/meteor.png";


// !!! Add condition to stop when dead !!!
//Recursively called with set interval. Adds meteors to the array with random x coordinates.
let CallMeteor = function(){
    if(paused === false){
        let x = Math.random() * (canvas.width - 100);
        x = Math.round(x);
        let y = -30;
        meteors_array.push({x: x, y: y});
    }
    setTimeout(CallMeteor, 750)//Change this value to change interval of meteors spawn
};


//Draws meteors, manages the gravity (by updating y coordinates) and deletes the meteors from array when they reach the bottom of the screen.
let animateMeteors = function (){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawBackground();

    meteors_array.forEach((meteor, index) => {
        meteor.y = meteor.y + 5;//Change this value to change the speed of meteors
        ctx.drawImage(meteorImage, meteor.x, meteor.y, 100, 100);

        if(meteor.y > canvas.height){
            meteors_array.splice(index, 1);
        }
    });

    if(paused === false){
        animationFrameID = requestAnimationFrame(animateMeteors)
    }
};


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//In game pause menu
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
let paused = false;
let animationFrameID;


let pauseButton = function(){
    const button = document.createElement("button");
    button.innerText = "☰"
    button.style.position = "absolute";
    button.style.top = "10px";
    button.style.left = "10px";

    button.onclick = function(){
        paused = true;
        cancelAnimationFrame(animationFrameID); // Stop the animation loop
        showPauseMenu();
    };
    document.body.appendChild(button);
};


function showPauseMenu() {
    const overlay = document.createElement("div");
    overlay.id = "pause-menu";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.color = "white";
    overlay.style.fontSize = "24px";
    overlay.style.zIndex = "1000";

    const text = document.createElement("p");
    text.innerText = "Game Paused";
    overlay.appendChild(text);


    const optionButton = document.createElement("button");
    optionButton.innerText = "Options";
    overlay.appendChild(optionButton);

    const goBackMenuButton = document.createElement("button");
    goBackMenuButton.innerText = "Main menu";
    overlay.appendChild(goBackMenuButton);


    const quitPauseMenuButton = document.createElement("button");
    quitPauseMenuButton.innerText = "X"
    quitPauseMenuButton.style.position = "absolute";
    quitPauseMenuButton.style.top = "10px";
    quitPauseMenuButton.style.left = "10px";
    quitPauseMenuButton.onclick = function(){
        if(game_started === true){
            paused = false;
            hidePauseMenu();
            animateMeteors(); // Restart the animation loop
        }
        else{
            hidePauseMenu();
        }
    };

    overlay.appendChild(quitPauseMenuButton);
    document.body.appendChild(overlay);
}

function hidePauseMenu() {
    const overlay = document.getElementById("pause-menu");
    if (overlay) {
        overlay.remove();
    }
}


