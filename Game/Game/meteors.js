import { gameState, game_started, drawBackground } from './game.js';
import { drawPlayer, jetActions, updateBullets } from './jet.js';
import { canvas, ctx } from './constant.js';



let meteors_array = [];//Array to manage multiple meteors at the same time
const meteorImage = new Image();
meteorImage.src = "../Game/Images/meteor.png";


// !!! Add condition to stop when dead !!!
//Recursively called with set interval. Adds meteors to the array with random x coordinates.
export let CallMeteor = function(){
    if(gameState.paused === false){
        let x = Math.random() * (canvas.width - 100);
        x = Math.round(x);
        let y = -30;
        meteors_array.push({x: x, y: y});
    }
    setTimeout(CallMeteor, 750)//Change this value to change interval of meteors spawn
};


//Draws meteors, manages the gravity (by updating y coordinates) and deletes the meteors from array when they reach the bottom of the screen.
export let animateMeteors = function (){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawBackground();

    //Calls the jet and its actions
    if (game_started) {
        drawPlayer();
        jetActions();
        updateBullets();
    }

    meteors_array.forEach((meteor, index) => {
        meteor.y = meteor.y + 5;//Change this value to change the speed of meteors
        ctx.drawImage(meteorImage, meteor.x, meteor.y, 100, 100);

        if(meteor.y > canvas.height){
            meteors_array.splice(index, 1);
        }
    });

    if(gameState.paused === false){
        gameState.animationFrameID = requestAnimationFrame(animateMeteors)
    }
};