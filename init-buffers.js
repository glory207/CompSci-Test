const positionsCube = new Array([// Front face 0
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
], [// Back face 1
  -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
], [// Top face 2
  -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
], [// Bottom face 3
  -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
], [// Right face 4
  1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
], [// Left face 5
  -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
  ], [// Z face L 8
    -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
], [// X face F 6
  0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0,
], [// Y face T 7
  -1.0, 0.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0,

]);
const textureCoordinatesCube = new Array([// Front
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
], [// Back
  0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
], [// Top
  0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
], [// Bottom
  0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0,
], [// Right
  0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
], [// Left
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
], [// Front da
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
], [// Front da
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
], [// Front da
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
]);

const vertexTangentCube = new Array([
  // Front
  0.0, 1.0, 0.0,
], [// Back
  0.0, 1.0, 0.0,
], [// Top
  0.0, 0.0, -1.0,
], [// Bottom
  0.0, 0.0, -1.0,
], [// Right
  0.0, 1.0, 0.0,
], [// Left
  0.0, 1.0, 0.0,
  ], [// Left
    0.0, 0.0, -1.0,
], [// Top
  1.0, 0.0, 0.0,
  ], [// Back
  0.0, 1.0, 0.0,
],[// Front
  0.0, 1.0, 0.0,
]);

const vertexNormalsCube = new Array([
    // Front
    0.0, 0.0, 1.0,
  ], [// Back
    0.0, 0.0, -1.0,
  ], [// Top
    0.0, 1.0, 0.0,
  ], [// Bottom
    0.0, -1.0, 0.0,
  ], [// Right
    1.0, 0.0, 0.0,
  ], [// Left
    -1.0, 0.0, 0.0,
    ], [// Left
      -1.0, 0.0, 0.0,
  ], [// Top
    0.0, 1.0, 0.0,
    ], [// Back
    0.0, 0.0, 1.0,
  ],[  // Front
  0.0, 0.0, 1.0,
]);

const vertexBiTangentCube = new Array([
    // Front
    1.0, 0.0, 0.0,
  ], [// Back
    1.0, 0.0, 0.0,
  ], [// Top
    1.0, 0.0, 0.0,
  ], [// Bottom
    1.0, 0.0, 0.0,
  ], [// Right
    0.0, 0.0, 1.0,
  ], [// Left
    0.0, 0.0, 1.0,
    ], [// Left
      -1.0, 0.0, 0.0,
  ], [// Top
    0.0, 1.0, 0.0,
    ], [// Back
    0.0, 0.0, 1.0,
  ], [// Front
  1.0, 0.0, 0.0,
]);


function initBuffers(gl, i) {

  return {
    position: initPositionBuffer(gl, i),
    textureCoord: initTextureBuffer(gl, i),
    indices: initIndexBuffer(gl, i),
    tangent: initTangentBuffer(gl, i),
    normal: initNormalBuffer(gl, i),
      biTangent: initbiTangentBuffer(gl, i),
    length: i.length * 6,
  };
}
function initNormalBuffer(gl, i) {
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  var positions = new Array();
  for (var j = 0; j < i.length; j++) {
    positions = positions.concat(vertexNormalsCube[i[j]]);
    positions = positions.concat(vertexNormalsCube[i[j]]);
    positions = positions.concat(vertexNormalsCube[i[j]]);
    positions = positions.concat(vertexNormalsCube[i[j]]);
  }

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW,
  );

  return normalBuffer;
}
function initbiTangentBuffer(gl, i) {
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  var positions = new Array();
  for (var j = 0; j < i.length; j++) {
    positions = positions.concat(vertexBiTangentCube[i[j]]);
    positions = positions.concat(vertexBiTangentCube[i[j]]);
    positions = positions.concat(vertexBiTangentCube[i[j]]);
    positions = positions.concat(vertexBiTangentCube[i[j]]);
  }

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW,
  );

  return normalBuffer;
}
function initTangentBuffer(gl, i) {
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  var positions = new Array();
  for (var j = 0; j < i.length; j++) {
    positions = positions.concat(vertexTangentCube[i[j]]);
    positions = positions.concat(vertexTangentCube[i[j]]);
    positions = positions.concat(vertexTangentCube[i[j]]);
    positions = positions.concat(vertexTangentCube[i[j]]);
  }

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW,
  );

  return normalBuffer;
}
function initPositionBuffer(gl, i) {
  // Create a buffer for the square's positions.
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var positions = new Array();
  for (var j = 0; j < i.length; j++) {
    positions = positions.concat(positionsCube[i[j]]);
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}
function initIndexBuffer(gl, i) {
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  var indices = new Array();
  for (var j = 0; j < i.length; j++) {
    indices = indices.concat([0 + (4 * j), 1 + (4 * j), 2 + (4 * j), 0 + (4 * j), 2 + (4 * j), 3 + (4 * j)]);
  }


  // Now send the element array to GL

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  return indexBuffer;
}
function initTextureBuffer(gl, i) {
  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  var textureCoordinates = new Array();
  for (var j = 0; j < i.length; j++) {
    textureCoordinates = textureCoordinates.concat(textureCoordinatesCube[i[j]]);
  }


  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    gl.STATIC_DRAW
  );

  return textureCoordBuffer;
}
export { initBuffers };