import { drawRactagnle,drawDownPath,keyListners,drawObstacle,spawnObstacle,isColliding,isFrontSideCollision} from "./reusable.js";
/** @type {HTMLCanvasElement} */

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const canvas = document.getElementById('mycanvas');
const leftBtn = document.getElementById('leftbtn');
const rightBtn = document.getElementById('rightbtn');
const jumpBtn = document.getElementById('jumpbtn');

function lockLandscape() {
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape')
      .catch(() => console.log("Orientation lock not supported"));
  }
  else if (window.screen.lockOrientation) {
    window.screen.lockOrientation('landscape');
  }
}



if (isMobile) {
  const updateCanvasSize = () => {
    const isPortrait = window.innerHeight > window.innerWidth;
    if (isPortrait) {
      // Force landscape dimensions
      canvas.width = window.innerHeight;
      canvas.height = window.innerWidth;
      
      // Rotate canvas 90 degrees
      canvas.style.transform = 'rotate(90deg)';
      canvas.style.transformOrigin = 'center';
      canvas.style.position = 'absolute';
      canvas.style.top = `${(window.innerHeight - window.innerWidth)/2}px`;
      canvas.style.left = `${(window.innerWidth - window.innerHeight)/2}px`;
    } else {
      // Already landscape
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.transform = 'none';
    }
  };

  window.addEventListener('resize', updateCanvasSize);
  updateCanvasSize();
  lockLandscape();
  window.addEventListener('orientationchange', updateCanvasSize);
  
  // Prevent touch events from scrolling page
  document.body.addEventListener('touchmove', (e) => {
    if (e.target === canvas) e.preventDefault();
  }, { passive: false });
} else {
  // Desktop layout
  canvas.width = 1200;
  canvas.height = 700;
  leftBtn.style.display = 'none'
  rightBtn.style.display = 'none'
  jumpBtn.style.display = 'none'
}


const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restartBtn')
let gameOver = false

const width = canvas.width;
const height = canvas.height;

const params = {
  rectHeight: 50,
  rectWidth: 50,
  x: width/3,
  y: height - 100,
  speed: 3,
  valocityY : 0,
  gravity : 0.5,
  isJumping : false,
  jumpPower : -12,
};

const keys = {
  left : false,
  right : false,
}


let obstacle = [];
for(let i = 0; i < 3; i++) spawnObstacle(width,height,obstacle)


const tilesWidth = 100;
const groundTiles = [];

for(let i = 0; i < Math.ceil(width / tilesWidth ) + 2 ; i++){
  groundTiles.push({
    x : i * tilesWidth,
    y : height - 50,
    width : tilesWidth,
    height : 50,
    color : '#000000'
  })
}

const tileIncrementer = () => {
  groundTiles.forEach(tile => {
    if(tile.x + tile.width < 0){
      tile.x = Math.max(...groundTiles.map(t => t.x)) + tilesWidth
    }
  })
}

window.onload = () => {
  keyListners(keys,params)
}

function updateObstacle(){
  obstacle.forEach(o => {
    o.x -= params.speed;
  })

  for (let o of obstacle) {
      if (isFrontSideCollision(params, o)) {
          console.log("Hit front side! Player OUT");
          gameOver = true;
          gameOverButton()
          return
      }
  }

  obstacle = obstacle.filter(o => o.x + o.width > 0)

  const lastX = Math.max(...obstacle.map(o => o.x))
  if(lastX < width + 300){
    spawnObstacle(width,height,obstacle)
  }
}

function render(){
  ctx.clearRect(0,0,width,height)
  drawDownPath(ctx,groundTiles)
  drawRactagnle(ctx,width,height,params)
  drawObstacle(ctx,obstacle)
  updateObstacle()
  
}

function update(){
   if (gameOver) {
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over", width / 2 - 50, height / 2);
    return;
  }
  if(keys.left) params.x -= params.speed;
  if(keys.right){
    if(keys.right) params.x += params.speed;
    groundTiles.forEach(tile => tile.x -= params.speed)
  }

  params.valocityY += params.gravity;
  params.y += params.valocityY

  for(let i = 0; i < obstacle.length; i++){
    const o = obstacle[i]
    if(isColliding(params,o)){
      const playerBottom = params.y + params.rectHeight;
      const obstacleTop = o.y;
  
      if(params.valocityY >= 0 && playerBottom - params.valocityY <= obstacleTop){
        params.y = o.y - params.rectHeight;
        params.valocityY = 0;
        params.isJumping = false
      }else{
        if(params.x < o.x){
          params.x = o.x - params.rectWidth;
        }else{
          params.x = o.x + params.rectWidth;
        }
      }
    }
  }

  const groundY = height - 100;
  if(params.y >= groundY){
    params.y = groundY;
    params.valocityY = 0;
    params.isJumping = false
  }

  params.x = Math.max(0,Math.min(width - params.rectWidth,params.x))
  render();
  tileIncrementer()
  requestAnimationFrame(update)
}

update();

function gameOverButton() {
  cancelAnimationFrame(update);
  restartBtn.style.display = "block";
}

restartBtn.addEventListener("click", () => {
  location.reload(); // refresh the page and restart everything
});