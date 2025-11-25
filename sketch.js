let spriteSheet;
let walkSpriteSheet;
let jumpSpriteSheet;
let currentFrame = 0;
let animationSpeed = 0.15; // 控制動畫速度
let characterX = 0; // 角色 X 位置
let characterSpeed = 3; // 移動速度
let isJumping = false;
let jumpFrame = 0; // 浮點數用於逐幀
var __game = window.__game || {};
__game.spriteSheet = __game.spriteSheet || null;
__game.walkSpriteSheet = __game.walkSpriteSheet || null;
__game.jumpSpriteSheet = __game.jumpSpriteSheet || null;
__game.frameWidth = 523 / 8; // 每幀寬度 (523 / 8 = 65.375)
__game.frameHeight = 91;
__game.currentFrame = __game.currentFrame || 0;
__game.animationSpeed = __game.animationSpeed || 0.15; // 控制動畫速度
var __game = window.__game || {};
__game.spriteSheet = __game.spriteSheet || null;
__game.walkSpriteSheet = __game.walkSpriteSheet || null;
__game.jumpSpriteSheet = __game.jumpSpriteSheet || null;
__game.frameWidth = 523 / 8; // 每幀寬度 (523 / 8 = 65.375)
__game.frameHeight = 91;
__game.currentFrame = __game.currentFrame || 0;
__game.animationSpeed = __game.animationSpeed || 0.15; // 控制動畫速度
__game.characterX = __game.characterX || 0; // 角色 X 位置
__game.characterSpeed = __game.characterSpeed || 3; // 移動速度

// jump 相關
__game.isJumping = __game.isJumping || false;
__game.jumpFrame = __game.jumpFrame || 0; // 浮點數用於逐幀
__game.jumpFrameSpeed = __game.jumpFrameSpeed || 0.25; // 跳躍動畫速度
__game.jumpFrames = 8;
__game.jumpFrameWidth = 707 / 8;
__game.jumpFrameHeight = 84;
__game.jumpHeight = 150; // 跳躍高度 (像素)

function preload() {
  __game.spriteSheet = loadImage('1/walk/all3.png');
  __game.walkSpriteSheet = loadImage('1/walk/all5.png');
  __game.jumpSpriteSheet = loadImage('1/jump/all6.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();
  // 初始位置置中
  __game.characterX = width / 2;
}

function draw() {
  // 設定背景顏色為 003049
  background('#003049');

  // 偵測按鍵（左右移動、跳躍啟動）
  var walkingRight = false;
  var walkingLeft = false;

  if (keyIsDown(RIGHT_ARROW)) {
    walkingRight = true;
    __game.characterX += __game.characterSpeed;
  }
  if (keyIsDown(LEFT_ARROW)) {
    walkingLeft = true;
    __game.characterX -= __game.characterSpeed;
  }

  // 若按上鍵且未在跳躍中，開始跳躍（只觸發一次直到動畫結束）
  if (keyIsDown(UP_ARROW) && !__game.isJumping) {
    __game.isJumping = true;
    __game.jumpFrame = 0;
  }

  // 限制角色在畫布內
  __game.characterX = constrain(__game.characterX, 0, width);

  // 選擇使用的精靈圖和幀設置
  var currentSpriteSheet;
  var totalFrames;
  var currentFrameWidth;
  var currentFrameHeight;
  var frameIndex = 0;
  var yOffset = 0;

  if (__game.isJumping) {
    currentSpriteSheet = __game.jumpSpriteSheet;
    totalFrames = __game.jumpFrames;
    currentFrameWidth = __game.jumpFrameWidth;
    currentFrameHeight = __game.jumpFrameHeight;

    // 更新跳躍幀
    __game.jumpFrame += __game.jumpFrameSpeed;
    if (__game.jumpFrame >= totalFrames) {
      // 跳躍結束，回到原位
      __game.isJumping = false;
      __game.jumpFrame = 0;
    }
    frameIndex = min(floor(__game.jumpFrame), totalFrames - 1);

    // 根據動畫進度計算垂直位移（sin 曲線，上升再下降）
    var progress = frameIndex / (totalFrames - 1);
    yOffset = -sin(progress * PI) * __game.jumpHeight;
  } else if (walkingLeft || walkingRight) {
    currentSpriteSheet = __game.walkSpriteSheet;
    totalFrames = 5;
    currentFrameWidth = 270 / 5; // 54
    currentFrameHeight = 84;

    __game.currentFrame = (__game.currentFrame + __game.animationSpeed) % totalFrames;
    frameIndex = floor(__game.currentFrame);
  } else {
    currentSpriteSheet = __game.spriteSheet;
    totalFrames = 8;
    currentFrameWidth = __game.frameWidth;
    currentFrameHeight = __game.frameHeight;

    __game.currentFrame = (__game.currentFrame + __game.animationSpeed) % totalFrames;
    frameIndex = floor(__game.currentFrame);
  }

  // 計算精靈圖的開始位置
  var sx = frameIndex * currentFrameWidth;
  var sy = 0;

  // 角色顯示位置（以畫面中間為基準，並受跳躍偏移影響）
  var baseY = height / 2;
  var x = __game.characterX;
  var y = baseY + yOffset;

  // 保存當前繪製狀態
  push();
  translate(x, y);

  // 若向左走或在空中向左移動，則翻轉圖片
  var flip = walkingLeft;
  if (flip) {
    scale(-1, 1);
  }

  // 繪製精靈（從 spritesheet 的對應幀截取）
  if (currentSpriteSheet) {
    image(currentSpriteSheet, -currentFrameWidth / 2, -currentFrameHeight / 2, currentFrameWidth, currentFrameHeight, sx, sy, currentFrameWidth, currentFrameHeight);
  }

  // 恢復繪製狀態
  pop();

 }

// 視窗大小改變時調整畫布
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

