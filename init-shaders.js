
var vsSources = [`
                  attribute vec4 aVertexPosition;
                  attribute vec2 aTextureCoord;
                  attribute vec3 aNormal;
                  attribute vec3 aTangent;
                  attribute vec3 aBiTangent;
                  uniform mat4 uModelViewMatrix;
                  uniform mat4 uProjectionMatrix;
                  uniform vec4 uTextureMatrix;
                  uniform mat3 uNormalMatrix;
                  varying highp mat3 tbn;
                  varying highp vec2 col;
                  varying highp vec3 norm;
                  varying highp vec3 pos;
                  void main() {
                  pos = (uModelViewMatrix * aVertexPosition).xyz;
                    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                    col = (aTextureCoord + uTextureMatrix.xy) * uTextureMatrix.zw;
                    vec3 t =  normalize((uNormalMatrix) * aTangent);
                    vec3 b =  normalize((uNormalMatrix) * aBiTangent);
                  vec3 n = normalize((uNormalMatrix) * aNormal);
                  tbn = mat3(b, t, n);
                   norm = n;
                  }
                `];

var fsSources = [`
                  precision mediump float;
                  varying highp vec3 pos;
                  varying highp vec2 col;
                  varying highp vec3 norm;
                  varying highp mat3 tbn;
                  uniform vec3 uModelCol;
                  
                  uniform vec3 lightPos[3];
                  uniform vec3 lightCol[3];
                  uniform bool TH;
                  uniform bool TF;
                  
                  uniform int isColor;
                  uniform float time;
                  uniform sampler2D uSampler1;
                  uniform sampler2D uSampler2;
                  void main() {
                   if(isColor == 0) gl_FragColor = vec4(uModelCol, 1.0);
                   else{
                    vec4 c = texture2D(uSampler1, col);
                    vec4 cc = texture2D(uSampler2, col);
                    vec3  normal;
                    if(TF){ normal = (cc.xyz * 2.0) - vec3(1);
                    normal =  (tbn *  normal);
                    }
                    else{
                    normal = norm;
                    }
                  vec3 diffuse = vec3(0,0,0);

                  for (int currentLight = 0; currentLight < 3; currentLight++) {
                    vec3 lightVec = lightPos[currentLight] - pos;
                    float dist = length(lightVec)/50.0;
                    float a = 3.0;
                    float b = 0.7;
                    float Falloff = 1.0 / (a * dist * dist + b * dist + 1.0);
                      vec3 lightDirection = normalize(lightVec);

                      float difVal = max(dot(normal, lightDirection), 0.0) * Falloff;
                      const float deCount = 4.0;
                      if(TH){
                     
                      for(float count = deCount; count >= 0.0; count--) {
                        if(difVal > (count/deCount)){
                        difVal = (count/deCount);
                        break;
                        }
                      } 
                      }
                      else {
                      if(difVal < 0.1){
                        difVal = 0.0;
                        }
                      }
                      diffuse += lightCol[currentLight] * difVal * 2.0;

                  }
                  
                    diffuse += vec3(0.02);
                    gl_FragColor =  vec4(c.xyz * diffuse ,c.w);
                    if(c.w < 0.5) discard;
                    }
                    
                  }
                `,`
                precision mediump float;
                uniform vec3 uModelCol;
                void main() {
                  gl_FragColor = vec4(uModelCol, 1.0);
                }
                `
                 ];
//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource1, fsSource1) {
  const vsSource = vsSources[vsSource1];
  const fsSource = fsSources[fsSource1];
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram,
      )}`,
    );
    return null;
  }
  var programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      texturePosition: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
      normal: gl.getAttribLocation(shaderProgram, "aNormal"),
      tangent: gl.getAttribLocation(shaderProgram, "aTangent"),
      biTangent: gl.getAttribLocation(shaderProgram, "aBiTangent"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      textureMatrix: gl.getUniformLocation(shaderProgram, "uTextureMatrix"),
      normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
      color: gl.getUniformLocation(shaderProgram, "uModelCol"),
      isColor: gl.getUniformLocation(shaderProgram, "isColor"),
      time: gl.getUniformLocation(shaderProgram, "time"),
      uSampler1: gl.getUniformLocation(shaderProgram, "uSampler1"),
      uSampler2: gl.getUniformLocation(shaderProgram, "uSampler2"),
    },
  };
  return programInfo;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
export { initShaderProgram };