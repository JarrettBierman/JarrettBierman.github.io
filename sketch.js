let w = 1600;
let h = 300;

function setup(){
    var canvas = createCanvas(w, h);
    canvas.parent('sketch');
}

function draw(){
    var letterX = mouseX - w/2;
    var letterY = mouseY - h/2;
    var letterDivisor = [75, 80, 85, 90, 95, 100, 125, 150, 175, 200, 225, 250, 275, 300];
    var letterSize = 200;
    var textXOffset = 0;
    var textYOffset = 75;

    background("#f8e9a1");
    // background(230);
    textSize(letterSize);
    textAlign(CENTER);
    textFont("Lucida Sans Unicode");
    fill(0);
    fill("#888aa8");
    for(var i = 0; i < letterDivisor.length; i++){
        text("Jarrett Bierman", width/2 + letterX/letterDivisor[i] + textXOffset, height/2 + letterY/letterDivisor[i] + textYOffset); //bottom jb
    }
    fill("#25274d");
    text("Jarrett Bierman", width/2 + textXOffset, height/2 + textYOffset); //top jb
}