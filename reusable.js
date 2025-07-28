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
    let {rectHeight,rectWidth,x,y,speed} = params
    ctx.beginPath()
    ctx.rect(x,y,rectWidth,rectHeight)
    ctx.fillStyle = '#e224e2ff';
    ctx.strokeStyle = '#478e09ff'
    ctx.strokeRect(x,y,rectWidth,rectHeight)
    ctx.fill()
    ctx.closePath()
}

export const drawDownPath = (ctx,groundTiles) => {
    groundTiles.forEach(tile => {
        ctx.beginPath()
        ctx.fillStyle = '#0e0e0eff';
        ctx.rect(tile.x,tile.y,tile.width,tile.height)
        ctx.fill()
        ctx.closePath()
    })
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

    const leftBtn = document.getElementById('leftbtn');
    const rightBtn = document.getElementById('rightbtn');
    const jumpBtn = document.getElementById('jumpbtn');

    if (leftBtn && rightBtn && jumpBtn) {
        leftBtn.addEventListener('touchstart', () => {
            keys.left = true;
        });
        leftBtn.addEventListener('touchend', () => {
            keys.left = false;
        });

        rightBtn.addEventListener('touchstart', () => {
            keys.right = true;
        });
        rightBtn.addEventListener('touchend', () => {
            keys.right = false;
        });

        jumpBtn.addEventListener('touchstart', () => {
            if (!params.isJumping) {
                params.valocityY = params.jumpPower;
                params.isJumping = true;
            }
        });
    }
}

export const drawObstacle = (ctx,obs) => {
    obs.map(o => {
        ctx.beginPath();
        ctx.fillStyle = o.color
        ctx.fillRect(o.x,o.y,o.width,o.height)
        ctx.closePath()

        ctx.beginPath();
        ctx.strokeStyle = '#ff1010';
        ctx.lineWidth = 3;
        ctx.moveTo(o.x, o.y);                   
        ctx.lineTo(o.x, o.y + o.height);        
        ctx.stroke();
        ctx.closePath();
    })
}

export const spawnObstacle = (width,height,obstacle) => {
    const lastX = Math.max(...obstacle.map(o => o.x),width)
    const gap = Math.random() * 200 + 350;
    const randomHeight = (Math.random() * 50) + 50;
    obstacle.push({
        x : lastX + gap,
        y : height - (50 + randomHeight),
        width : 50,
        height : randomHeight,
        color : '#98ed5bff'
    })
}

export const isColliding = (a,b) => {
    return (
        a.x < b.x + b.width && a.x + a.rectWidth > b.x && a.y < b.y + b.height && a.y + a.rectHeight > b.y
    )
}

export const isFrontSideCollision = (player, obstacle) => {
    const buffer = 5; // small buffer to allow clean edge detection
    return (
        player.x + player.rectWidth >= obstacle.x &&                 // touches left side
        player.x + player.rectWidth <= obstacle.x + buffer &&       // not deep inside
        player.y < obstacle.y + obstacle.height &&
        player.y + player.rectHeight > obstacle.y
    );
};