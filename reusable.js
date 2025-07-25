export function drawGrid(ctx,width,height){
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";

   for (let x = 0; x <= width; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.fillText(x, x + 2, 10); // Label x position
    }

    for(let y = 0 ; y <= height; y += 100){
        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(width,y);
        ctx.stroke();
        ctx.fillText(y,2,y-5)
    }
}

export const drawRactagnle = (ctx,width,height,params) => {
    let {rectHeight,rectWidth,rectX,rectY,speed} = params
    ctx.clearRect(0,0,width,height)
    ctx.beginPath()
    ctx.rect(rectX,rectY,rectWidth,rectHeight)
    ctx.fillStyle = '#e224e2ff';
    ctx.strokeStyle = 'white'
    ctx.strokeRect(rectX,rectY,rectWidth,rectHeight)
    ctx.fill()
    ctx.closePath()
}

export const drawDownPath = (ctx,width,height) => {
    ctx.beginPath()
    ctx.rect(0,height - 50,width,50)
    ctx.fillStyle = '#39e739';
    ctx.fill()
    ctx.closePath()
}

export const keyListners = (keys,params) => {
    document.addEventListener('keydown',(e) => {
        if(e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft'){
            keys.left = true
        }else if(e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight'){
            keys.right = true
        }else if((e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp' || e.code === 'Space') && !params.isJumping){
            params.valocityY = params.jumpPower;
            params.isJumping = true;
        }
    })

    document.addEventListener('keyup',(e) => {
        if(e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft'){
            keys.left = false;
        }else if(e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight'){
            keys.right =false;
        }
    })
}