
function drawPoint(pos) {
    // convert coordinates to screen coordinates with 0,0 in the middle

    let screenX = canvas.width / 2 + pos.x * 10000 * scaleValue;
    let screenY = canvas.height / 2 - pos.y * 10000 * scaleValue;

    let radius = 3000 * scaleValue

    ctx.beginPath();

    ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(screenX, screenY, radius * .8, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
}

function drawPendulumLine(begin, end) {

    let screenX = canvas.width / 2 + begin.x * 10000 * scaleValue;
    let screenY = canvas.height / 2 - begin.y * 10000 * scaleValue;

    let screenX2 = canvas.width / 2 + end.x * 10000 * scaleValue;
    let screenY2 = canvas.height / 2 - end.y * 10000 * scaleValue;


    ctx.beginPath();
    ctx.moveTo(screenX, screenY);
    ctx.lineTo(screenX2, screenY2);
    ctx.lineWidth = 1000 * scaleValue;
    ctx.strokeStyle = 'white';
    ctx.stroke();
}


g = { x: 0, y: -10 }
pos1 = { x: 4, y: 2 }
pos2 = { x: 6, y: 2 }
pos3 = { x: 8, y: 2 }
vel2 = { x: 0, y: -2 }
vel3 = { x: 0, y: 4 }
l1 = 2
l2 = 2

function springForce(p1, p2, l) {
    let dx = p2.x - p1.x
    let dy = p2.y - p1.y
    let d = Math.sqrt(dx * dx + dy * dy)
    let F = (d - l) * 100000
    let Fx = F * dx / d
    let Fy = F * dy / d
    return { x: Fx, y: Fy }
}

function addVectors(vectors) {

    let F = { x: 0, y: 0 }

    for (let i = 0; i < vectors.length; i++) {
        F.x += vectors[i].x
        F.y += vectors[i].y
    }

    return F
}

function updatePendulum() {

    substeps = 100
    dt = (1 / 60) / substeps

    for (let i = 0; i < substeps; i++) {


        F2 = addVectors([springForce(pos2, pos1, l1), springForce(pos2, pos3, l2), g])
        F3 = addVectors([springForce(pos3, pos2, l2), g])

        vel2.x = vel2.x + F2.x * dt
        vel2.y = vel2.y + F2.y * dt

        vel3.x = vel3.x + F3.x * dt
        vel3.y = vel3.y + F3.y * dt

        pos2.x = pos2.x + vel2.x * dt
        pos2.y = pos2.y + vel2.y * dt

        pos3.x = pos3.x + vel3.x * dt
        pos3.y = pos3.y + vel3.y * dt


    }
    drawPendulumLine(pos1, pos2)
    drawPendulumLine(pos2, pos3)
    drawPoint(pos1)
    drawPoint(pos2)
    drawPoint(pos3)
}