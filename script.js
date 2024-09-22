
const cursor = document.querySelector('.cursor');
const content = document.querySelector('.content');
const links = document.querySelectorAll('a');
const zoomhint = document.querySelector('#zoomhint');
const name = document.querySelector('.name');
const lipsum = document.querySelector('#lipsum');
const pf = document.querySelector('#pf');
const hline = document.querySelector('.horizontal-line');

links.forEach(link => {
    link.addEventListener('mouseover', () => {
        cursor.classList.add('hovering-link');
    });
    link.addEventListener('mouseout', () => {
        cursor.classList.remove('hovering-link');
    });
});

const moveCursor = (e) => {
    const mouseY = e.clientY;
    const mouseX = e.clientX;

    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;


}

window.addEventListener('mousemove', moveCursor)



let targetScaleValue = 1;
let scaleValue = 1;

window.addEventListener('wheel', function (e) {

    let deltaScaleValue = 1 - e.deltaY * 0.0005
    targetScaleValue *= Math.max(0.98, Math.min(1.02, deltaScaleValue))

    targetScaleValue = Math.max(0, Math.min(1, targetScaleValue));

});


const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);


function drawLine(begin, end, opacity) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(100, 100, 100, ' + opacity + ')';
    ctx.lineWidth = 2;
    ctx.moveTo(begin.x, begin.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}

function createGrid(width, opacity) {

    drawLine({ x: 0, y: canvas.height / 2 }, { x: canvas.width, y: canvas.height / 2 }, opacity);
    drawLine({ y: 0, x: canvas.width / 2 }, { y: canvas.height, x: canvas.width / 2 }, opacity);

    for (let i = width; i < canvas.width / 2; i += width) {

        drawLine({ x: canvas.width / 2 + i, y: 0 }, { x: canvas.width / 2 + i, y: canvas.height }, opacity);
        drawLine({ x: canvas.width / 2 - i, y: 0 }, { x: canvas.width / 2 - i, y: canvas.height }, opacity);

        drawLine({ y: canvas.height / 2 + i, x: 0 }, { y: canvas.height / 2 + i, x: canvas.width }, opacity);
        drawLine({ y: canvas.height / 2 - i, x: 0 }, { y: canvas.height / 2 - i, x: canvas.width }, opacity);

    }
}

function setGrid(amount) {
    amount = 10
    let frameSize = scaleValue
    log_value = Math.log(frameSize) / Math.log(2)
    rounded_log_value = Math.ceil(log_value)
    closestPowerOfTwo = Math.pow(2, rounded_log_value);
    distanceToPowerOfTwo = rounded_log_value - log_value;
    width = (frameSize / closestPowerOfTwo) / amount * canvas.width
    createGrid(width, 1)
    createGrid(width / 2, 1 - distanceToPowerOfTwo)
}

let container = document.querySelector('.container');
let mask = document.querySelector('.mask');

let doneFirstAnimation = false
let doneFirstZoomHintAnimation = false

function update() {

    t = .3
    scaleValue = scaleValue + t * (targetScaleValue - scaleValue)

    content.style.transform = `scale(${scaleValue})`;


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setGrid();

    if (scaleValue < .4) {
        container.style.animation = 'rotateContainer 2s forwards';
        mask.style.animation = 'setMask 2s forwards';
        name.style.animation = 'moveUp 1s forwards'
        lipsum.style.animation = 'fadeIn 1s forwards';
        name.style.animationDelay = '1s'
        lipsum.style.animationDelay = '1.5s'

        doneFirstAnimation = true
    }
    else if (doneFirstAnimation) {
        container.style.animation = 'reverseRotateContainer 1s forwards';
        mask.style.animation = 'reverseSetMask 2s forwards';
        name.style.animation = 'moveDown 1s forwards'
        lipsum.style.animation = 'fadeOut .5s forwards';
        name.style.animationDelay = '0s'
    }

    if (scaleValue < .8) {
        zoomhint.style.animation = 'fadeOut 1s forwards';
        pf.style.animation = 'fadeIn 1s forwards';
        hline.style.animation = 'fadeIn 1s forwards';
        doneFirstZoomHintAnimation = true;
    }
    else {
        zoomhint.style.animation = 'fadeIn 1s forwards';
        if (doneFirstZoomHintAnimation) {
            pf.style.animation = 'fadeOut 1s forwards';
            hline.style.animation = 'fadeOut 1s forwards';
        }
    }

    if (scaleValue < 0.05) {
        updatePendulum();
    }


}

setInterval(update, 1000 / 60);