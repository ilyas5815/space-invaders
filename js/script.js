let dead = new Audio();
let left = new Audio();
dead.src = "audio/dead.mp3";
left.src = "audio/left.mp3";


var interval
var ctx = document.getElementById("canvas").getContext("2d")

function gameObject(x, y, img) {
    this.x = x; this.y = y; this.img = img; this.active = true
}

gameObject.prototype.draw = function (ctx) {
    this.active && ctx.drawImage(this.img, this.x, this.y, 40, 40)
}

gameObject.prototype.move = function (dx, dy) {
    this.x += dx; this.y += dy
}

gameObject.prototype.fire = function (dy) {
    return new shot(this.x + 20, this.y + 20, dy)

}

gameObject.prototype.isHitBy = function (Shot) {
    function between(x, a, b) {
        return a < x && x < b
    }
    return this.active && between(Shot.x, this.x, this.x + 40) && between(Shot.y + 10, this.y, this.y + 20)

}
function shot(x, y, dy) {
    this.x = x; this.y = y; this.dy = dy;

}
shot.prototype.move = function () {
    this.y += this.dy
    return this.y > 0 && this.y < 600
}

shot.prototype.draw = function (ctx) {
    ctx.fillStyle = "#073b4c"
    ctx.fillRect(this.x - 1, this.y, 3, 20)
}

var invaderDx = -5
var invaders = []
var cannon = new gameObject(230, 550, document.getElementById("cannon"))
var invaderShot, cannonShot


function init() {
    var img = document.getElementById("invader")
    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 8; x++) {
            invaders.push(new gameObject(50 + x * 50, 20 + y * 50, img))
        }
    }

}


function draw() {
    ctx.fillStyle = "#118ab2"
    ctx.fillRect(0, 0, 500, 600)
    invaders.forEach(inv => inv.draw(ctx))
    cannon.draw(ctx)
    invaderShot && invaderShot.draw(ctx)
    cannonShot && cannonShot.draw(ctx)

}


function move() {
    var leftX = invaders[0].x, rightX = invaders[invaders.length - 1].x
    if (leftX <= 20 || rightX >= 440) invaderDx = -invaderDx
    invaders.forEach(inv => inv.move(invaderDx, 0.5))
    if (invaderShot && !invaderShot.move()) {
        invaderShot = null
    }
    if (!invaderShot) {
        var active = invaders.filter(i => i.active)
        var r = active[Math.floor(Math.random() * active.length)]
        invaderShot = r.fire(20)
    }
    if (cannonShot) {
        var hit = invaders.find(inv => inv.isHitBy(cannonShot))
        if (hit) {
            hit.active = false
            cannonShot = null
            left.play();
        }
        else {
            if (!cannonShot.move()) cannonShot = null
        }
    }
}
function isGameOver() {
    return cannon.isHitBy(invaderShot) || invaders.find(inv => inv.active && inv.y > 530)
}


function game() {
    move()
    draw()
    if (isGameOver()) {
        dead.play();
        alert("Game over");
        clearInterval(interval)
        location.reload();
    }
}

function start() {
    init()
    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 37 && cannon.x > 40) cannon.move(-20, 0)
        if (e.keyCode == 39 && cannon.x < 420) cannon.move(20, 0)
        if (e.keyCode == 32 && !cannonShot) cannonShot = cannon.fire(-30)

    })
    interval = setInterval(game, 50)
}
window.onload = start