// let w = window.innerWidth;
// let h = window.innerHeight;
let w = 900;
let h = 500;
var player;
var pfs;
var score;
var lost;
var readyToRead;

function setup(){
    createCanvas(w, h);
    reset();
}

function reset(){
    player = new Player();
    pfs = [];
    score = 0;
    lost = false;
    readyToRead = true;
    
    let pfn = 6;
    let pfxi = 200;
    let pfyi = 40;
    for(let i = 0; i < pfn; i++){
        pfs.push(new Platform(i*pfxi, i*pfyi + 50));
    }
    loop();
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) player.left = true;
    if (keyCode === RIGHT_ARROW) player.right = true;
    if ((keyCode === 32 || keyCode === UP_ARROW) && !player.inAir) player.up = true;
    if (keyCode === 13 && lost) reset();
    
}
function keyReleased() {
    if (keyCode === LEFT_ARROW) player.left = false;
    if (keyCode === RIGHT_ARROW) player.right = false;
    if (keyCode === UP_ARROW) player.up = false;
}

function handleGamePhysics() {
    for(pf of pfs){
        if(player.intersects(pf.x, pf.y, pf.w, pf.h) && player.vy > 0){
            player.vy = 0;
            player.y = pf.y - player.s;
        }
        if(Math.abs(player.vy) < 0.1)   player.inAir = false;
        else                            player.inAir = true;
    }
    
    if(player.y > h+50){
        lost = true;
    }
}

function handleScore() {
    if(!lost){
        score += 0.1;
    }
    text(floor(score), 20, 20);
}

function readFromDataBase(score){
    define( function (require) {
        const MongoClient = require('mongodb').MongoClient;
        const uri = "mongodb+srv://jarrett:beerbottle711@cluster0.fc5sj.mongodb.net/JumpMan?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            const collection = client.db("JumpMan").collection("scores");
            collection.insertOne({
                name: "Jarrett",
                id: Math.floor(Math.random() * 100000),
                score: score
            });
            console.log("Succesfully added to database");
            client.close();
        });
    });
}

function handleLoss(){
    if(readyToRead){
        console.log("You lose");
        readFromDataBase();
        readyToRead = false;
    }
}

function draw(){
    background(127);

    player.update();
    player.draw();

    for(pf of pfs){
        pf.update();
        pf.draw();
    }
    handleGamePhysics();
    handleScore();

    if(lost){
        handleLoss();
    }
}

class Player {
    constructor() {
        this.s = 30;
        this.x = 10;
        this.y = 10;
        this.vx = 0;
        this.vy = 0;
        this.accel = 1;
        this.dragMult = 0.4;
        this.max = 7;
        this.gravity = 0.4;
        this.jumpPow = 13;
        this.up = this.left = this.right = false;
        this.inAir = true;
    }
    intersects(rx, ry, rw, rh) {
        return this.x < rx+rw && this.x+this.s > rx && this.y+this.s > ry && this.y < ry+rh;
    }

    draw() {
        noStroke();
        fill(0);
        rect(this.x, this.y, this.s);
    }

    update() {
        //vx
        if(this.left && this.vx > -this.max){
            this.vx -= this.accel;
        }
        else if(this.right && this.vx < this.max){
            this.vx += this.accel;
        }
        else if(!this.left && !this.right){
            if(this.vx > 0){
                this.vx -= this.accel*this.dragMult;
            }
            else if(this.vx < 0){
                this.vx += this.accel*this.dragMult;
            }
            if(Math.abs(this.vx) < this.dragMult){
                this.vx = 0;
            }
        }

        //vy
        this.vy += this.gravity;

        if(this.up && !this.inAir) {
            this.vy = -this.jumpPow;
            this.up = false;
            this.inAir = true;
        }


        this.x += this.vx;
        this.y += this.vy;
    }
    
    land() {
        this.vx = 0;
    }
}

class Platform {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.w = 125;
        this.h = 10;
        this.speed = -5;
        this.vy = 0;
    }

    draw() {
        fill(255);
        rect(this.x, this.y, this.w, this.h);
    }

    update(){
        this.x += this.speed;

        if (this.x + this.w < 0 && !lost){
            let randX = w;
            let randY = floor(random(20, h-20));
            this.x = randX;
            this.y = randY;
        }

        if(lost){
            this.vy += random(-2, 2);
            this.y += this.vy;
        }
    }
}