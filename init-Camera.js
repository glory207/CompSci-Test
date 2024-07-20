
import { SpObj } from "./object.js";
import { loadTexture } from "./init-texture.js";
class Camera {
  constructor(gl, pos, rot) {
    this.spd = 0.4;
    this.rot = rot;
    this.pos = pos;
    this.acc = [0.0, 0.0];
    this.inp = [0, 0];
    this.arm = [0.0, 4.0, 12.0];
    this.obj = new SpObj(gl, [pos[0], pos[1] + 3.0, pos[2]], [0.0, 0.0, 0.0], [3.0, 3.0, 0.01], [0.2, 0.5, 0.3, 1.0], 6, 9, [0])
    this.dir = [0, 0];
  }

  matrix(aspect) {
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const zNear = 0.1;
    const zFar = 1000.0;
    const projectionMatrix = mat4.create();
    const view = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);


    mat4.translate(
      view, // destination matrix
      view, // matrix to translate
      [-this.arm[0], -this.arm[1], -this.arm[2]],
    ); // amount to translate
    // start drawing the square.
    mat4.rotate(
      view, // destination matrix
      view, // matrix to rotate
      -this.rot[0], // amount to rotate in radians
      [1, 0, 0],
    )
    mat4.rotate(
      view, // destination matrix
      view, // matrix to rotate
      -this.rot[1], // amount to rotate in radians
      [0, 1, 0],
    )
    mat4.rotate(
      view, // destination matrix
      view, // matrix to rotate
      -this.rot[2], // amount to rotate in radians
      [0, 0, 1],
    )

    mat4.translate(
      view, // destination matrix
      view, // matrix to translate
      [-this.pos[0], -this.pos[1], -this.pos[2]],
    ); // amount to translate
    // start drawing the square.
    mat4.multiply(view, projectionMatrix, view);

    return view;
  }

  draw(gl, programInfo, cam, tim) {

    this.obj.pos = [this.pos[0], this.pos[1] + 3.0, this.pos[2]];
    var aer = Math.PI - Math.abs(Math.abs((this.obj.rot[1] % (Math.PI * 2)) - (this.rot[1] % (Math.PI * 2))) - Math.PI)
    this.dir[1] = 0;
    var count = 2;
    
    if (this.inp[0] == 0 && this.inp[1] == 0) {
      this.obj.texture = loadTexture(gl, 6);
      this.obj.texture2 = loadTexture(gl, 11);
      count = 16;

      this.obj.rot[1] = this.obj.rot[1] - (this.obj.rot[1] - this.rot[1]) * 0.05;
    }
    else {
      
      this.obj.rot[1] = this.obj.rot[1] - (this.obj.rot[1] - this.rot[1]) * 0.3;
      if (this.spd == 0.2) {
        this.obj.texture = loadTexture(gl, 5);
        this.obj.texture2 = loadTexture(gl, 10);
        count = 24;
      }
     if (this.spd == 0.5) {
          this.obj.texture = loadTexture(gl, 14);
          this.obj.texture2 = loadTexture(gl, 15);
          count = 20;
      }
        if (this.spd == 0.05) {
        this.obj.texture = loadTexture(gl, 7);
        this.obj.texture2 = loadTexture(gl, 8);
        count = 28;
      }

      
    }
    if (this.inp[0] == -1 && this.inp[1] == 0) {
      this.dir[0] = 1;
    }
    if (this.inp[0] == -1 && this.inp[1] == 1) {
      this.dir[0] = 2;
    }
    if (this.inp[0] == 0 && this.inp[1] == 1) {
      this.dir[0] = 3;
    }
    if (this.inp[0] == 1 && this.inp[1] == 1) {
      this.dir[0] = 4;
    }
    if (this.inp[0] == 1 && this.inp[1] == 0) {
      this.dir[0] = 5;
    }
    if (this.inp[0] == 1 && this.inp[1] == -1) {
      this.dir[0] = 6;
    }
    if (this.inp[0] == 0 && this.inp[1] == -1) {
      this.dir[0] = 7;
    }
    if (this.inp[0] == -1 && this.inp[1] == -1) {
      this.dir[0] = 0;
    }
    if ((this.dir[0] == 3 || this.dir[0] == 7) && aer > Math.PI / 2.0) this.dir[1] = 4;
    if ((this.dir[0] == 4 || this.dir[0] == 0) && aer > Math.PI / 2.0) this.dir[1] = 2;
    if ((this.dir[0] == 6 || this.dir[0] == 2) && aer > Math.PI / 2.0) this.dir[1] = -2;

    this.obj.textOff = [Math.floor((tim * 20.0) % (count - 1)), (this.dir[0] + this.dir[1] - 0.001) % 8, 1.0 / count, 1.0 / 8.0];



    this.obj.drawScene(gl, programInfo, cam, tim);
  }
}
export { Camera };