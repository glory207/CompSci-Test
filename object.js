import { initBuffers } from "./init-buffers.js";
import { loadTexture } from "./init-texture.js";


class SpObj{
  constructor(gl, pos, rot, sca, col, imj,imj2, sides){
    this.rot = rot;
    this.pos = pos;
    this.sca = sca;
    this.col = col;
    this.textOff = [0,0,1,1];

    this.buffers = initBuffers(gl,sides);
    this.texture = loadTexture(gl, imj);
    this.texture2 = loadTexture(gl, imj2);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
  }

  drawScene(gl, programInfo, cam,tim) {
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

    
    const modelViewMatrix = mat4.create();


  
    mat4.translate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to translate
      [this.pos[0],this.pos[1],this.pos[2]],
    ); // amount to translate
    // start drawing the square.


    mat4.rotate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to rotate
      this.rot[0], // amount to rotate in radians
      [1, 0, 0],
    )

    mat4.rotate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to rotate
      this.rot[1], // amount to rotate in radians
      [0, 1, 0],
    )

    mat4.rotate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to rotate
      this.rot[2], // amount to rotate in radians
      [0, 0, 1],
    )


    mat4.scale(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to scale
      [this.sca[0],this.sca[1],this.sca[2]],
    ); // amount to translate


    // Set the shader uniforms
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      cam,
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix,
    );
    const normalMatrix = mat3.create();
    mat3.fromMat4(normalMatrix, modelViewMatrix);
    mat3.invert(normalMatrix, normalMatrix);
    mat3.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix3fv(
      programInfo.uniformLocations.normalMatrix,
      false,
      normalMatrix,
    );
    
    gl.uniform3f(
      programInfo.uniformLocations.color,
      this.col[0],this.col[1],this.col[2],
    );
    
    gl.uniform4f(
      programInfo.uniformLocations.textureMatrix,
      this.textOff[0],this.textOff[1],this.textOff[2],this.textOff[3]
    );
    setPositionAttribute(gl, this.buffers, programInfo);

    setColorAttribute(gl, this.buffers, programInfo);
    
    setNormalAttribute(gl, this.buffers, programInfo);
      setTangentAttribute(gl, this.buffers, programInfo);
      setbiTangentAttribute(gl, this.buffers, programInfo);
    if(this.texture != false){
      
    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
      
      gl.uniform1i(programInfo.uniformLocations.isColor, 1);
      
    }
    else gl.uniform1i(programInfo.uniformLocations.isColor, 0);
     gl.uniform1f(programInfo.uniformLocations.time, tim * 0.1);
    
    if(this.texture2 != false){
      
    // Tell WebGL we want to affect texture unit 0
    
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texture2);


    }
    gl.uniform1i(programInfo.uniformLocations.uSampler1, 0);
    gl.uniform1i(programInfo.uniformLocations.uSampler2, 1);
    
      const offset = 0;
      const vertexCount = this.buffers.length;
    const type = gl.UNSIGNED_SHORT;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    
  }

}


// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setNormalAttribute(gl, buffers, programInfo) {
  const numComponents = 3; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
  gl.vertexAttribPointer(
    programInfo.attribLocations.normal,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.normal);
}
// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setTangentAttribute(gl, buffers, programInfo) {
  const numComponents = 3; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.tangent);
  gl.vertexAttribPointer(
    programInfo.attribLocations.tangent,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.tangent);
}
// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setbiTangentAttribute(gl, buffers, programInfo) {
  const numComponents = 3; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.biTangent);
  gl.vertexAttribPointer(
    programInfo.attribLocations.biTangent,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.biTangent);
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 3; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

// Tell WebGL how to pull out the colors from the color buffer
// into the vertexColor attribute.
function setColorAttribute(gl, buffers, programInfo) {
  const numComponents = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
  gl.vertexAttribPointer(
    programInfo.attribLocations.texturePosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.texturePosition);
}

export { SpObj };