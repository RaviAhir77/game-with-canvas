import { drawRactagnle,drawDownPath,keyListners,drawObstacle, isColliding} from "./reusable.js";
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');
const clearbtn = document.getElementById('clearBtn')

const width = canvas.width;
const height = canvas.height;

const params = {
  rectHeight: 50,
  rectWidth: 50,
  x: 50,
  y: 550,
  speed: 5,
  valocityY : 0,
  gravity : 0.5,
  isJumping : false,
  jumpPower : -12,
};

const keys = {
  left : false,
  right : false,
}

const obstacle = {
  x : 400,
  y : height - 100,
  width : 50,
  height : 50,
  color : '#98ed5bff'
}

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

keyListners(keys,params)

function render(){
  ctx.clearRect(0,0,width,height)
  drawDownPath(ctx,groundTiles)
  drawRactagnle(ctx,width,height,params)
  drawObstacle(ctx,obstacle)
}

function update(){
  if(keys.left) params.x -= params.speed;
  // if(keys.right) params.x += params.speed;
  if(keys.right){
    groundTiles.forEach(tile => tile.x -= params.speed)
  }

  params.valocityY += params.gravity;
  params.y += params.valocityY

  if(isColliding(params,obstacle)){
    const playerBottom = params.y + params.rectHeight;
    const obstacleTop = obstacle.y;

    if(params.valocityY >= 0 && playerBottom - params.valocityY <= obstacleTop){
      params.y = obstacle.y - params.rectHeight;
      params.valocityY = 0;
      params.isJumping = false
    }else{
      if(params.x < obstacle.x){
        params.x = obstacle.x - params.rectWidth;
      }else{
        params.x = obstacle.x + params.rectWidth;
      }
    }
  }

  const groundY = 600;
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
