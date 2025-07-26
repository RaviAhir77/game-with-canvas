import { drawRactagnle,drawDownPath,keyListners,drawObstacle,spawnObstacle,isColliding} from "./reusable.js";
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');
const clearbtn = document.getElementById('clearBtn')

const width = canvas.width;
const height = canvas.height;

const params = {
  rectHeight: 50,
  rectWidth: 50,
  x: 350,
  y: 550,
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

keyListners(keys,params)

function updateObstacle(){
  obstacle.forEach(o => {
    o.x -= params.speed;
  })

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
  if(keys.left) params.x -= params.speed;
  // if(keys.right) params.x += params.speed;
  if(keys.right){
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
