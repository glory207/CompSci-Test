const texturesNames = new Array("brick.jpg",
  "pixel-art-kick-boxer-character-2-png.png",
  "marble star.jpg",
  "cubetexture.png",
  "dude.png",
  "charWalk.png",
  "CharIdle.png",
  "CharTipToe.png",
  "CharTipToeNorm.png",
  "abcde.png",
  "charWalkNorm.png",
  "CharIdleNorm.png",
  "abcd.jpg",
  "abcd.png",
  "charRun.png",
  "charRunNorm.png",
);

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
var textureUrl = new Array();
var textures = new Array();
function loadTexture(gl, url){
  if(url == -1) return false;
  const urli = textureUrl.findIndex((element) => element == texturesNames[url]);
 
  if(urli == -1)
  {
    textureUrl.push(texturesNames[url]);
    textures.push(loadTexture2(gl, texturesNames[url]));
   return textures[textures.length -1];
  }
  else{
     return textures[urli];
  }
}
function loadTexture2(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be downloaded over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel,
  );

  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image,
    );

    // WebGL1 has different requirements for power of 2 images
    // vs. non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
  };
  image.src = url;

  return texture;
}
function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

export { loadTexture };