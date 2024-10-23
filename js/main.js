const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const BASE_WIDTH = 1080;  // デザインの基準幅
const BASE_HEIGHT = 1920; // デザインの基準高さ
const amidaBorderHeight = 6;
let amidaArray = [[], [], []]; // 初期の空配列
let isClick = false
let ClickItem = 0;
// 各配列にランダムな0か1を3つずつ追加する
amidaArray = amidaArray.map(subArray =>
  Array.from({ length: amidaBorderHeight }, () => Math.floor(Math.random() * 2))
);
let scaleX, scaleY; // スケーリング係数

// 9:16のアスペクト比でキャンバスのサイズを調整する関数
function resizeCanvas() {
  const aspectRatio = 9 / 16;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if (windowWidth / windowHeight > aspectRatio) {
    canvas.height = windowHeight;
    canvas.width = windowHeight * aspectRatio;
  } else {
    canvas.width = windowWidth;
    canvas.height = windowWidth / aspectRatio;
  }

  // スケーリング係数の計算
  scaleX = canvas.width / BASE_WIDTH;
  scaleY = canvas.height / BASE_HEIGHT;
}

// ボタンの配列（ABCDの4つ）
const buttons = [
  { x: 108, y: 218, width: 100, height: 100, color: 'blue', hoverColor: 'green', text: 'A', isHovered: false, item: 0 },
  { x: 348, y: 218, width: 100, height: 100, color: 'blue', hoverColor: 'green', text: 'B', isHovered: false, item: 1 },
  { x: 580, y: 218, width: 100, height: 100, color: 'blue', hoverColor: 'green', text: 'C', isHovered: false, item: 2 },
  { x: 821, y: 218, width: 100, height: 100, color: 'blue', hoverColor: 'green', text: 'D', isHovered: false, item: 3 }
];

// ボタンを描画する関数
function drawButtons() {
  buttons.forEach(button => {
    ctx.fillStyle = button.isHovered ? button.hoverColor : button.color;
    ctx.fillRect(
      button.x * scaleX,
      button.y * scaleY,
      button.width * scaleX,
      button.height * scaleY
    );

    // ボタンのテキストを描画
    ctx.fillStyle = 'white';
    ctx.font = `${40 * scaleY}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      button.text,
      (button.x + button.width / 2) * scaleX,
      (button.y + button.height / 2) * scaleY
    );
  });
}
function drawBorder() {
  ctx.strokeStyle = 'black';  // 線の色
  ctx.lineWidth = 4;         // 線の太さ

  for (let i = 0; i < 4; i++) {
    // 直線を描画
    ctx.beginPath();            // 新しいパスを開始
    ctx.moveTo((150 + i * 250) * scaleX, 360 * scaleY);         // 始点の座標 (x, y)
    ctx.lineTo((150 + i * 250) * scaleX, 1560 * scaleY);       // 終点の座標 (x, y)
    ctx.stroke();               // パスに沿って線を描く
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < amidaBorderHeight; j++) {
      if (i == 1) {
        if (amidaArray[i + 1][j] == 1 || amidaArray[i - 1][j]) {
          amidaArray[i][j] = 0;
          continue;
        }
      }
      if (amidaArray[i][j] == 1) {
        ctx.beginPath();            // 新しいパスを開始
        ctx.moveTo((150 + i * 250) * scaleX, (360 + ((j + 1) * 171)) * scaleY);         // 始点の座標 (x, y)
        ctx.lineTo((150 + (i + 1) * 250) * scaleX, (360 + ((j + 1) * 171)) * scaleY);       // 終点の座標 (x, y)
        ctx.stroke();
      }
    }
  }
}

// マウスの位置を取得する関数
function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (BASE_WIDTH / canvas.width),
    y: (event.clientY - rect.top) * (BASE_HEIGHT / canvas.height)
  };
}

// マウスがボタン上にあるか確認する関数
function isMouseOverButton(mousePos, button) {
  return (
    mousePos.x >= button.x &&
    mousePos.x <= button.x + button.width &&
    mousePos.y >= button.y &&
    mousePos.y <= button.y + button.height
  );
}

// マウスムーブイベントでホバー状態を更新
canvas.addEventListener('mousemove', (event) => {
  const mousePos = getMousePos(event);
  buttons.forEach(button => {
    button.isHovered = isMouseOverButton(mousePos, button);
  });
});
// 真っすぐは 0,右なら1,左なら2で
// マウスクリックイベントでボタンを検出
let answer = [];
let answer2 = [];
canvas.addEventListener('click', (event) => {
  const mousePos = getMousePos(event);
  buttons.forEach(button => {
    if (isMouseOverButton(mousePos, button)) {
      isClick = true
      ClickItem = button.item;
      let a = { moveToX: (150 + ClickItem * 250), moveToY: 360, lineToX: (150 + (ClickItem) * 250), lineToY:(360 + ( 171)), item: 1}
      answer2.push(a)
      for (let j = 0; j < amidaBorderHeight; j++) {
        if (ClickItem == 0) {
          if (amidaArray[ClickItem][j] == 1) {
            answer.push(1)
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (360 + ((j + 1) * 171)), lineToX: (150 + (ClickItem + 1) * 250), lineToY:(360 + ((j + 1) * 171)), item: 1}
            ClickItem = 1
            let b =  { moveToX: (150 + ClickItem * 250), moveToY: (360 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY:(360 + ((j + 2) * 171)), item: 1}
            answer2.push(b)
            answer2.push(a)
          } else {
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (360 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY:(360 + ((j + 2) * 171)), item: 1}
            answer2.push(a)
            answer.push(0)
          }
        } else if (ClickItem == 1) {
          if (amidaArray[ClickItem][j] == 1) {
            answer.push(1)
            let a = { moveToX: (150 + ClickItem * 250) , moveToY: (360 + ((j + 1) * 171)), lineToX: (150 + (ClickItem + 1) * 250), lineToY:(360 + ((j + 1) * 171)), item: 1}
            console.log(amidaArray)
            ClickItem = 2
            let b =  { moveToX: (150 + ClickItem * 250), moveToY: (360 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY:(360 + ((j + 2) * 171)), item: 1}
            answer2.push(b)
            answer2.push(a)
          } else if (amidaArray[ClickItem - 1][j] == 1) {
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (360 + ((j + 1) * 171)), lineToX: (150 + (ClickItem - 1) * 250), lineToY:(360 + ((j + 1) * 171)), item: 1}
            answer.push(2);
            answer2.push(a)
            ClickItem = 0
            let b =  { moveToX: (150 + ClickItem * 250), moveToY: (360 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250) , lineToY:(360 + ((j + 2) * 171)) , item: 1}
            answer2.push(b)
          } else {
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (360 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250) , lineToY:(360 + ((j + 2) * 171)) , item: 1}
            answer2.push(a)
            answer.push(0);
          }
        } else if (ClickItem == 2) {
          if (amidaArray[ClickItem][j] == 1) {
            answer.push(1)
            console.log(amidaArray)
            let a = { moveToX: (150 + ClickItem * 250) , moveToY: (360 + ((j + 1) * 171)), lineToX: (150 + (ClickItem + 1) * 250), lineToY:(360 + ((j + 1) * 171)), item: 3}
            ClickItem = 3
            let b =  { moveToX: (150 + ClickItem * 250), moveToY: (360 + ((j + 1) * 171)) , lineToX: (150 + (ClickItem) * 250), lineToY:(360 + ((j + 2) * 171)), item: 1}
            answer2.push(b)
            answer2.push(a)
          } else if (amidaArray[ClickItem - 1][j] == 1) {
            answer.push(2);
            let a = { moveToX: (150 + ClickItem * 250) , moveToY: (360 + ((j + 1) * 171)), lineToX: (150 + (ClickItem - 1) * 250) , lineToY:(360 + ((j + 1) * 171)), item: 1}
            ClickItem = 1
            let b =  { moveToX: (150 + ClickItem * 250), moveToY: (360 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY:(360 + ((j + 2) * 171)), item: 1}
            answer2.push(b)
            answer2.push(a)
          } else {
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (360 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY:(360 + ((j + 2) * 171)), item: 1}
            answer2.push(a)
            answer.push(0);
          }
        } else {
          if (amidaArray[ClickItem - 1][j] == 1) {
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (360 + ((j + 1) * 171)), lineToX: (150 + (ClickItem - 1) * 250), lineToY:(360 + ((j + 1) * 171)), item: 1}
            answer2.push(a)
            answer.push(2)
            ClickItem = 2
            let b =  { moveToX: (150 + ClickItem * 250) , moveToY: (360 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY:(360 + ((j + 2) * 171)), item: 1}
            answer2.push(b)
          } else {
            let a = { moveToX: (150 + ClickItem * 250) , moveToY: (360 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY:(360 + ((j + 2) * 171)), item: 1}
            answer2.push(a)
            answer.push(0)
          }
        }
      }
    }
    console.log(answer)
  });
});
//ラインを書く関数
function drawLine(ctx, startX, startY, endX, endY) {
  ctx.strokeStyle = 'red';  // 線の色
  ctx.lineWidth = 4;         // 線の太さ
  ctx.beginPath(); // 新しいパスを開始
  ctx.moveTo(startX * scaleX, startY * scaleY); // 始点の座標 (x, y)
  ctx.lineTo(endX * scaleX, endY * scaleY); // 終点の座標 (x, y)
  ctx.stroke(); // 線を描画
}
// メインループ
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 画面をクリア
  drawButtons(); // ボタンを描画
  drawBorder();

  if (isClick) {
    for(let i = 0; i < answer2.length; i++) {
      drawLine(ctx,answer2[i].moveToX,answer2[i].moveToY,answer2[i].lineToX,answer2[i].lineToY);
    }
  }
  requestAnimationFrame(gameLoop); // 次のフレームを予約
}

// リサイズ時にキャンバスを再調整
window.addEventListener('resize', resizeCanvas);

// 初期化
resizeCanvas();
gameLoop();
