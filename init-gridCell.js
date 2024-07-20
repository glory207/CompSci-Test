import { SpObj } from "./object.js";

class Cell {
  constructor(gl, pos, rot, sca, type) {
    if(type == 0)
    {
      this.obj =
              new SpObj(
              gl,
              [pos[0] + 0.0,pos[1] - sca[1],pos[2] + 0.0],
              [rot[0] + 0.0,rot[1] + 0.0,rot[2] + 0.0],
              sca,
              [Math.random(), Math.random(), Math.random(), 1.0], 12,12,[2])
      ;
    }
    else {
      this.obj =
        new SpObj(
        gl,
        [pos[0] + 0.0,pos[1] + sca[1],pos[2] + 0.0],
        [rot[0] + 0.0,rot[1] + 0.0,rot[2] + 0.0],
        sca,
        [Math.random(), Math.random(), Math.random(), 1.0], 0,9,[0,1,2,3,4,5])
;
    }
  }

  drawScene(gl, programInfo, camMatrix, time){
      this.obj.drawScene(gl, programInfo, camMatrix, time);
    
    
  }
}

export { Cell };