import { drawRactagnle,drawDownPath,keyListners} from "./reusable.js";
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');
const clearbtn = document.getElementById('clearBtn')

const width = canvas.width;
const height = canvas.height;

const params = {
  rectHeight: 50,
  rectWidth: 50,
  rectX: 50,
  rectY: 550,
  speed: 5,
  valocityY : 0,
  gravity : 0.5,
  isJumping : false,
  jumpPower : -12,
};

const keys = {
  left : false,
  right : false,
  up : false,
}

keyListners(keys,params)

function render(){
  drawRactagnle(ctx,width,height,params)
  drawDownPath(ctx,width,height)
}

function update(){
  if(keys.left) params.rectX -= params.speed;
  if(keys.right) params.rectX += params.speed;

  params.valocityY += params.gravity;
  params.rectY += params.valocityY

  const groundY = 600;
  if(params.rectY >= groundY){
    params.rectY = groundY;
    params.valocityY = 0;
    params.isJumping = false
  }

  params.rectX = Math.max(0,Math.min(width - params.rectWidth,params.rectX))
  render();
  requestAnimationFrame(update)
}

update()







