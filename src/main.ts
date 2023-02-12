import { setUniforms, setDefaults, createBufferInfoFromArrays, createProgramInfo, createTexture, drawBufferInfo, getContext, resizeCanvasToDisplaySize, setBuffersAndAttributes, resizeTexture, createContext } from 'twgl.js';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const gl = getContext(canvas, { 
  antialias: false,
  alpha: true, 
  depth: false,
  stencil: false,
  premultipliedAlpha: true, 
  preserveDrawingBuffer: true 
});

setDefaults({
  attribPrefix: 'a_',
  textureColor: [0, 0, 0, 1],
})


const programInfo = createProgramInfo(gl, [vertexShader, fragmentShader]);

let bufferWidth = Math.pow(2, Math.ceil(Math.log2(canvas.clientWidth)));
let bufferHeight = Math.pow(2, Math.ceil(Math.log2(canvas.clientHeight)));
let arrayBufferView = new Uint8Array(bufferWidth * bufferHeight * 4) as PixelArray;
arrayBufferView.width = bufferWidth;
arrayBufferView.height = bufferHeight;

const textureOptions = {
  width: arrayBufferView.width,
  height: arrayBufferView.height,
  target: gl.TEXTURE_2D,
  level: 0,
  minMag: gl.NEAREST,
  internalFormat: gl.RGBA,
  format: gl.RGBA,
  type: gl.UNSIGNED_BYTE,
  src: arrayBufferView,
  wrap: gl.CLAMP_TO_EDGE,
}
let texture = createTexture(gl, textureOptions);

gl.clearColor(0, 0, 0, 1);
gl.enable(gl.CULL_FACE);

gl.useProgram(programInfo.program);
setUniforms(programInfo, {
  u_texture: texture,
});

type PixelArray = Uint8Array & {
  width: number;
  height: number;
};

const bufferInfo = createBufferInfoFromArrays(gl, {
  position: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1] },
});

const setPixel = (x: number, y: number, color: { r: number, g: number, b: number, a: number }) => {
  const index = (y * arrayBufferView.width + x) * 4;
  arrayBufferView[index] = color.r;
  arrayBufferView[index + 1] = color.g;
  arrayBufferView[index + 2] = color.b;
  arrayBufferView[index + 3] = color.a;
};

const resize = () => {
  if (!resizeCanvasToDisplaySize(canvas)) {
    return;
  }

  gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

  bufferWidth = Math.pow(2, Math.ceil(Math.log2(canvas.clientWidth)));
  bufferHeight = Math.pow(2, Math.ceil(Math.log2(canvas.clientHeight)));
  arrayBufferView = new Uint8Array(bufferWidth * bufferHeight * 4) as PixelArray;
  arrayBufferView.width = bufferWidth;
  arrayBufferView.height = bufferHeight;

  resizeTexture(gl, texture, {
    width: arrayBufferView.width,
    height: arrayBufferView.height,
  });
};

const logFPS = (() => {
  let lastTime = 0;
  let frames = 0;
  return () => {
    const now = performance.now();
    frames++;
    if (now - lastTime >= 1000) {
      console.log('FPS:', frames);
      lastTime = now;
      frames = 0;
    }
  };
})();


const blueTones = [
  { r: 0, g: 0, b: 255, a: 255 },
  { r: 0, g: 0, b: 200, a: 255 },
  { r: 0, g: 0, b: 150, a: 255 }
];

const rgbToHsv = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d === 0) {
    h = 0;
  } else if (max === r) {
    h = ((g - b) / d) % 6;
  } else if (max === g) {
    h = (b - r) / d + 2;
  } else if (max === b) {
    h = (r - g) / d + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) {
    h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h, s, v };
};

const hsvToRgb = (h: number, s: number, v: number) => {
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  return {
    r: Math.floor((r + m) * 255),
    g: Math.floor((g + m) * 255),
    b: Math.floor((b + m) * 255),
    a: 255,
  };
};

const getPixel = (x: number, y: number) => {
  const index = (y * arrayBufferView.width + x) * 4;
  return {
    r: arrayBufferView[index],
    g: arrayBufferView[index + 1],
    b: arrayBufferView[index + 2],
    a: arrayBufferView[index + 3],
  };
};

const fadeColorTo = (color: { r: number, g: number, b: number, a: number }, target: { r: number, g: number, b: number, a: number }) => {
  const hsv = rgbToHsv(color.r, color.g, color.b);
  const targetHsv = rgbToHsv(target.r, target.g, target.b);
  const h = hsv.h + (targetHsv.h - hsv.h) * 0.2;
  const s = hsv.s + (targetHsv.s - hsv.s) * 0.2;
  const v = hsv.v + (targetHsv.v - hsv.v) * 0.2;
  return hsvToRgb(h, s, v);
}

let frame = 0;
const render = () => {
  frame++;
  resize();

  logFPS();

  gl.useProgram(programInfo.program);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (let i = 0; i < 5; i++) {
    const x = Math.floor(Math.random() * canvas.clientWidth);
    const y = Math.floor(Math.random() * canvas.clientHeight);
    setPixel(x, y, hsvToRgb(Math.random() * 360, 
      Math.random() * 0.5 + 0.5,
      Math.random() * 0.5 + 0.5
    ));
  }

  const totalPixels = canvas.clientWidth * canvas.clientHeight;
  const chunkSize = 5000;
  const chunkCount = Math.ceil(totalPixels / chunkSize);

  const i = frame % chunkCount;
  const chunk = arrayBufferView.slice(i * 4, (i + chunkSize) * 4);
  const chunkPixels = chunk.length / 4;
  for (let j = 0; j < chunkPixels; j++) {
    const x = (i * chunkSize + j) % canvas.clientWidth;
    const y = Math.floor((i * chunkSize + j) / canvas.clientWidth);
    const pixel = getPixel(x, y);
    setPixel(x, y, fadeColorTo(pixel, {
      r: 0,
      g: 0,
      b: 0,
      a: 255,
    }))
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, canvas.clientWidth, canvas.clientHeight, gl.RGBA, gl.UNSIGNED_BYTE, arrayBufferView);
  setBuffersAndAttributes(gl, programInfo, bufferInfo);
  drawBufferInfo(gl, bufferInfo, gl.TRIANGLE_STRIP);

  requestAnimationFrame(render);
};

const setupUpdateChecker = () => {
  const version = process.env.VERSION;
  const url = `https://raw.githubusercontent.com/andrewiggins/andrewiggins.github.io/master/mandelbrot/version.txt?${Date.now()}`;
};

requestAnimationFrame(render);