import { initShaderProgram } from "./init-shaders.js";
import { Cell } from "./init-gridCell.js";
import { Camera } from "./init-Camera.js";
import { SpObj } from "./object.js";

import { loadTexture } from "./init-texture.js";
const canvas = document.querySelector("#glcanvas");
//var textBox = document.getElementById("textBox");
const gl = canvas.getContext("webgl");
var squares = new Array(
);
let time = 0.0;
let deltaTime = 0;
let then = 0;
var size = 15.0;
var cam = new Camera(gl, [0.0, 0.0, 0.0], [-0.2, -Math.PI / 2, 0.0]);
var sun = new SpObj(gl, [0.0, 5.0, 0.0], [0.0, 0.0, 0.0], [0.5, 0.5, 0.5], [0.0,1.0,0.0],-1,-1,[0,1,2,3,4,5])
var sun1 = new SpObj(gl, [0.0, 5.0, 0.0], [0.0, 0.0, 0.0], [0.5, 0.5, 0.5], [1.0,0.0,0.0],-1,-1,[0,1,2,3,4,5])
var sun2 = new SpObj(gl, [0.0, 5.0, 0.0], [0.0, 0.0, 0.0], [0.5, 0.5, 0.5], [0.0,0.0,1.0],-1,-1,[0,1,2,3,4,5])
// inputs
var UP = false;
var DW = false;
var LF = false;
var RT = false;
var SH = false;
var SP = false;
var TH = true;
var TF = true;
var programInfo;
var sunprogramInfo;
let gamepads = navigator.getGamepads()[0];
for(var i = 0; i < 16; i ++)loadTexture(gl,i);
window.addEventListener("gamepadconnected", (ev) => {
  console.log(`gampad Connected`);
  gamepads = navigator.getGamepads()[0];

  if (gamepads === null) {
    console.log("[null]");

  }
  else {
    console.log("    Index: " + gamepads.index);
    console.log("    ID: " + gamepads.id);
    console.log("    Axes: " + gamepads.axes.length);
    console.log("    Buttons: " + gamepads.buttons.length);
    console.log("    Mapping: " + gamepads.mapping);
  }
});
window.addEventListener("gamepaddisconnected", (ev) => {

  console.log(`gampad Disconnected`);

});

document.body.addEventListener("keydown", (ev) => {
  switch (ev.key.toLocaleLowerCase()) {
    case "w":
      UP = true;
      break;
    case "s":
      DW = true;
      break;
    case "a":
      LF = true;
      break;
    case "d":
      RT = true;
      break;
    case "shift":
      SH = true;
      break;
    case " ":
      SP = true;
      break;
    case "f":
        TH = !TH;
      break;
    case "g":
        TF = !TF;
      break;
    case "q":
      cam.arm[0] = Math.max(cam.arm[0]-2.0,-2.0);
      break;
    case "e":
      cam.arm[0] = Math.min(cam.arm[0]+2.0,2.0);
      break;
  }
});
document.body.addEventListener("keyup", (ev) => {
  switch (ev.key.toLocaleLowerCase()) {
    case "w":
      UP = false;
      break;
    case "s":
      DW = false;
      break;
    case "a":
      LF = false;
      break;
    case "d":
      RT = false;
      break;
    case "shift":
      SH = false;
      break;
    case " ":
      SP = false;
      break;
  }
});
document.body.addEventListener("mousemove", (ev) => {
  cam.rot[0] += -ev.movementY * 0.001;
  cam.rot[1] += -ev.movementX * 0.001;
 // cam.rot[0] = Math.max(-0.2, Math.min(0.2, cam.rot[0]));

});
document.body.addEventListener("click", async () => {
  canvas.requestPointerLock();
});
var grid = [
  [1, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 1, 1, 0],
  [1, 0, 0, 1, 1, 1, 0, 0, 0],
  [1, 0, 0, 0, 1, 1, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 1],
];
/*
grid = [
  [1]
];
*/
var frameCount = 0;
var frameTime = 0;
start();
function start() {

  // Initialize the GL context


  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it.",
    );
    return;
  }

   programInfo = initShaderProgram(gl, 0, 0);
     sunprogramInfo = initShaderProgram(gl, 0, 1);
  

  
  
  
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {

      squares.push(
        new Cell(gl, [(i ) * size * 2.0 + size, 0.0, (j) * size * 2.0 + size], [0.0, 0.0, 0.0], [size, size, size], grid[i][j])
      );
    }
  }

  requestAnimationFrame(render);
}
function render(now) {

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0.5, 0.5, 0.5, 0.9);
  gl.clearDepth(1.0);

  gl.viewport(0.0, 0.0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  frameCount++;
  now *= 0.001; // convert to seconds
  deltaTime = now - then;
  frameTime += deltaTime;
  then = now;
  if (frameTime > 1.0) {

    frameCount = 0;
    frameTime = 0;
  }
  Update();
  var camMatrix = cam.matrix(gl.canvas.clientWidth / gl.canvas.clientHeight);


  sun.pos = [cam.obj.pos[0] + Math.sin(time * 3.0) * 10.0 + Math.cos(time * 5.0) * 7.0,7.0 + Math.sin(time * 2.0) * 3.0,cam.obj.pos[2]   + Math.cos(time * 3.0) * 10.0 + Math.sin(time * 5.0) * 7.0];
  sun1.pos = [cam.obj.pos[0] + Math.cos(time * 3.0) * 10.0 + Math.sin(time * 5.0) * 7.0,7.0 + Math.cos(time * 2.0) * 3.0,cam.obj.pos[2]   + Math.sin(time * 3.0) * 10.0 + Math.sin(time * 5.0) * 7.0];
  sun2.pos = [cam.obj.pos[0] + Math.sin(time * 3.0) * 10.0 + Math.sin(time * 5.0) * 7.0,7.0 + Math.sin(time * 2.0) * 3.0,cam.obj.pos[2]   + Math.sin(time * 3.0) * 10.0 + Math.sin(time * 5.0) * 7.0];
  gl.useProgram(programInfo.program);
  gl.uniform3f(
    gl.getUniformLocation(programInfo.program, "lightPos[0]"),
    sun.pos[0],sun.pos[1],sun.pos[2],
  );
  gl.uniform3f(
    gl.getUniformLocation(programInfo.program, "lightPos[1]"),
    sun1.pos[0],sun1.pos[1],sun1.pos[2],
  );
  gl.uniform3f(
    gl.getUniformLocation(programInfo.program, "lightPos[2]"),
    sun2.pos[0],sun2.pos[1],sun2.pos[2],
  );
  gl.uniform3f(
    gl.getUniformLocation(programInfo.program, "lightCol[0]"),
    sun.col[0],sun.col[1],sun.col[2],
  );
  gl.uniform3f(
    gl.getUniformLocation(programInfo.program, "lightCol[1]"),
    sun1.col[0],sun1.col[1],sun1.col[2],
  );
  gl.uniform3f(
    gl.getUniformLocation(programInfo.program, "lightCol[2]"),
    sun2.col[0],sun2.col[1],sun2.col[2],
  );
  gl.uniform1i(
    gl.getUniformLocation(programInfo.program, "TH"),
    TH
  );
  gl.uniform1i(
    gl.getUniformLocation(programInfo.program, "TF"),
    TF
  );
  

  
  for (var i = 0; i < squares.length; i++) {
    squares[i].drawScene(gl, programInfo, camMatrix, time);
  }
 var sz = 50.0;
  
  cam.draw(gl, programInfo, camMatrix, time);
  gl.useProgram(sunprogramInfo.program);
  sun.drawScene(gl, sunprogramInfo, camMatrix, time);
  sun1.drawScene(gl, sunprogramInfo, camMatrix, time);
  sun2.drawScene(gl, sunprogramInfo, camMatrix, time);
  time += deltaTime;

  requestAnimationFrame(render);
}
function Update() {
  cam.inp = [0, 0];
  gamepads = navigator.getGamepads()[0];
  if (gamepads != null) {
    inp[0] += deltaTime * Math.round(gamepads.axes[0]);
    inp[1] -= deltaTime * Math.round(gamepads.axes[1]);

    cam.rot[0] += -Math.round(gamepads.axes[3]) * 0.05;

    cam.rot[0] = Math.max(-1.1, Math.min(0.25, cam.rot[0]));
    cam.rot[1] += -Math.round(gamepads.axes[2]) * 0.05;
  }
  if (UP) {
    cam.inp[1] = 1;
  }
  if (DW) {
    cam.inp[1] = -1;
  }
  if (LF) {
    cam.inp[0] = -1;
  }
  if (RT) {
    cam.inp[0] = 1;
  }
  if (SP) {
      cam.spd = 0.5;
    cam.obj.col = [0.0, 0.0, 1.0, 1.0];
  }
  else if (SH) {
      cam.spd = 0.05;
    cam.obj.col = [0.0, 0.0, 1.0, 1.0];
  }
  else {
      cam.spd = 0.2;
    cam.obj.col = [0.2, 0.5, 0.3, 1.0];
  }
  var move = [0, 0];
  move[1] = (cam.inp[1] * Math.cos(cam.rot[1]) + cam.inp[0] * Math.sin(cam.rot[1]));
  move[0] = (cam.inp[1] * Math.sin(cam.rot[1]) - cam.inp[0] * Math.cos(cam.rot[1]));
  if (move[0] * move[0] + move[1] * move[1] != 0) {
    var move_len = Math.sqrt(move[0] * move[0] + move[1] * move[1]);
    move[0] /= move_len;
    move[1] /= move_len;


    cam.acc[1] = move[1] * cam.spd;
    cam.acc[0] = move[0] * cam.spd;

  }

  cam.obj.col = [1.0, 0.0, 1.0, 1.0];
  cam.pos[2] -= cam.acc[1];
  cam.pos[0] -= cam.acc[0];
  cam.acc[1] = 0;
  cam.acc[0] = 0;
  
  colide(-1, 0);
  colide(1, 0);
  colide(0, -1);
  colide(0, 1);

  colide(1, 1);
  colide(-1, -1);
  colide(-1, 1);
  colide(1, -1);

}
function colide(i, j) {
  
  if (Math.floor((cam.pos[0]) / (size * 2)) + i >= 0 && Math.floor((cam.pos[0]) / (size * 2)) + i <= grid.length - 1 &&
    Math.floor((cam.pos[2]) / (size * 2)) + j >= 0 && Math.floor((cam.pos[2]) / (size * 2)) + j <= grid[0].length - 1) {
    if (grid[Math.floor((cam.pos[0]) / (size * 2)) + i][Math.floor((cam.pos[2]) / (size * 2)) + j] == 1) {

      if (i != 0 & j != 0) {
        if (inColider(cam.pos[0], i, true) && inColider(cam.pos[2], j, true)) {
          const LeftorRight = Math.abs(inColider(cam.pos[0], i, false)) - Math.abs(inColider(cam.pos[2], j, false));
          if (LeftorRight < 0) cam.pos[0] -= inColider(cam.pos[0], i, false);
          else if (LeftorRight > 0) cam.pos[2] -= inColider(cam.pos[2], j, false);
          else {
            cam.pos[0] -= inColider(cam.pos[0], i, false);
            cam.pos[2] -= inColider(cam.pos[2], j, false);
            
          }
        }

       
      }
      else {
        if (i != 0 && inColider(cam.pos[0], i, true)) {
          cam.pos[0] -= inColider(cam.pos[0], i, false);
          cam.obj.col = [1.0, 1.0, 1.0, 1.0];
        }

        if (j != 0 && inColider(cam.pos[2], j, true)) {
          cam.pos[2] -= inColider(cam.pos[2], j, false);
          cam.obj.col = [1.0, 1.0, 1.0, 1.0];
        }
      }
    }
  }
  function inColider(pos, i, a) {
    if (i > 0 & a) return pos % (size * 2) - (size * 2 - 2) > 0;
    if (i < 0 & a) return pos % (size * 2) - 2 < 0;
    if (i > 0 & !a) return pos % (size * 2) - (size * 2 - 2);
    if (i < 0 & !a) return pos % (size * 2) - 2;
    return 0;
  }

}





