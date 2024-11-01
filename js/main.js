const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const couponcode = "クーポンコード"
const inpu = "「○○○○」を入力し"
const get = "今すぐ獲得"
const atari = "大当たり";
const money = "$30"
const bonus = "入金不要ボーナス"
const url = "https://example.com"
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
  { x: 108, y: 38, width: 100, height: 100, color: 'blue', hoverColor: 'green', text: 'A', isHovered: false, item: 0 },
  { x: 348, y: 38, width: 100, height: 100, color: 'blue', hoverColor: 'green', text: 'B', isHovered: false, item: 1 },
  { x: 580, y: 38, width: 100, height: 100, color: 'blue', hoverColor: 'green', text: 'C', isHovered: false, item: 2 },
  { x: 821, y: 38, width: 100, height: 100, color: 'blue', hoverColor: 'green', text: 'D', isHovered: false, item: 3 }
];

// ボタンを描画する関数
function drawButtons() {
  buttons.forEach(button => {

    // ボタンのテキストを描画
    ctx.fillStyle = button.isHovered ? 'blue' : 'red';
    ctx.font = `${140 * scaleY}px Arial`;
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
    ctx.moveTo((150 + i * 250) * scaleX, 180 * scaleY);         // 始点の座標 (x, y)
    ctx.lineTo((150 + i * 250) * scaleX, 1380 * scaleY);       // 終点の座標 (x, y)
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
        ctx.moveTo((150 + i * 250) * scaleX, (180 + ((j + 1) * 171)) * scaleY);         // 始点の座標 (x, y)
        ctx.lineTo((150 + (i + 1) * 250) * scaleX, (180 + ((j + 1) * 171)) * scaleY);       // 終点の座標 (x, y)
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
  if(!isEnd) {
    const mousePos = getMousePos(event);
    buttons.forEach(button => {
      button.isHovered = isMouseOverButton(mousePos, button);
    });
  }
  
});
// 真っすぐは 0,右なら1,左なら2で
// マウスクリックイベントでボタンを検出
let answer = [];
let answer2 = [];
canvas.addEventListener('click', (event) => {
  const mousePos = getMousePos(event);
  if(!isEnd) {
  buttons.forEach(button => {
    if (isMouseOverButton(mousePos, button)) {
      isClick = true
      ClickItem = button.item;
      let a = { moveToX: (150 + ClickItem * 250), moveToY: 180, lineToX: (150 + (ClickItem) * 250), lineToY: (180 + (171)), item: 0, A: -171 }
      answer2.push(a)
      for (let j = 0; j < amidaBorderHeight; j++) {
        if (ClickItem == 0) {
          if (amidaArray[ClickItem][j] == 1) {
            answer.push(1)
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem + 1) * 250), lineToY: (180 + ((j + 1) * 171)), item: 1, A: -250 }
            ClickItem = 1
            let b = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY: (180 + ((j + 2) * 171)), item: 0, A: -171 }
            answer2.push(a)
            answer2.push(b)

          } else {
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY: (180 + ((j + 2) * 171)), item: 0, A: -171 }
            answer2.push(a)
            answer.push(0)
          }
        } else if (ClickItem == 1) {
          if (amidaArray[ClickItem][j] == 1) {
            answer.push(1)
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem + 1) * 250), lineToY: (180 + ((j + 1) * 171)), item: 1, A: -250 }
            console.log(amidaArray)
            ClickItem = 2
            let b = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY: (180 + ((j + 2) * 171)), item: 0, A: -171 }
            answer2.push(a)
            answer2.push(b)

          } else if (amidaArray[ClickItem - 1][j] == 1) {
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem - 1) * 250), lineToY: (180 + ((j + 1) * 171)), item: 2, A: 250 }
            answer.push(2);
            answer2.push(a)
            ClickItem = 0
            let b = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY: (180 + ((j + 2) * 171)), item: 0, A: -171 }
            answer2.push(b)
          } else {
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY: (180 + ((j + 2) * 171)), item: 0, A: -171 }
            answer2.push(a)
            answer.push(0);
          }
        } else if (ClickItem == 2) {
          if (amidaArray[ClickItem][j] == 1) {
            answer.push(1)
            console.log(amidaArray)
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem + 1) * 250), lineToY: (180 + ((j + 1) * 171)), item: 1, A: -250 }
            ClickItem = 3
            let b = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY: (180 + ((j + 2) * 171)), item: 0, A: -171 }
            answer2.push(a)
            answer2.push(b)

          } else if (amidaArray[ClickItem - 1][j] == 1) {
            answer.push(2);
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem - 1) * 250), lineToY: (180 + ((j + 1) * 171)), item: 2, A: 250 }
            ClickItem = 1
            let b = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY: (180 + ((j + 2) * 171)), item: 0, A: -171 }
            answer2.push(a)
            answer2.push(b)
          } else {
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY: (180 + ((j + 2) * 171)), item: 0, A: -171 }
            answer2.push(a)
            answer.push(0);
          }
        } else {
          if (amidaArray[ClickItem - 1][j] == 1) {
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem - 1) * 250), lineToY: (180 + ((j + 1) * 171)), item: 2, A: 250 }
            answer2.push(a)
            answer.push(2)
            ClickItem = 2
            let b = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY: (180 + ((j + 2) * 171)), item: 0, A: -171 }
            answer2.push(b)
          } else {
            let a = { moveToX: (150 + ClickItem * 250), moveToY: (180 + ((j + 1) * 171)), lineToX: (150 + (ClickItem) * 250), lineToY: (180 + ((j + 2) * 171)), item: 0, A: -171 }
            answer2.push(a)
            answer.push(0)
          }
        }
      }
    }
  });
}
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
let count = 0;
let isEnd = false
// メインループ
const img = new Image();
img.src = "../img/hukidashi.png"; // 画像URL

let rectX
let rectY
let rectWidth
let rectHeight
canvas.addEventListener("click", (event) => {
  // クリック位置の取得
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  // クリック位置が四角形の範囲内にあるかを判定
  if (
    clickX >= rectX &&
    clickX <= rectX + rectWidth &&
    clickY >= rectY &&
    clickY <= rectY + rectHeight
  ) {
    // 四角形がクリックされた場合にURLに飛ぶ
    window.location.href = url; // 遷移させたいURL
  }
});
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 画面をクリア

  drawButtons(); // ボタンを描画
  drawBorder();
  if (isClick) {
    console.log(answer2)
    if (count < answer2.length && answer2[count].item == 0) {
      console.log(count, answer2[count].A)
      answer2[count].A += 9
      if (answer2[count].A >= 0) {
        count += 1
        console.log(count)
        if (answer2.length == count) {
          isEnd = true

        }
      }
    } else if (count < answer2.length && answer2[count].item == 1) {
      answer2[count].A += 5
      if (answer2[count].A == 0) {
        count += 1
        if (answer2.length == count) {
          isEnd = true

        }
      }
    } else if (count < answer2.length) {
      answer2[count].A -= 5
      if (answer2[count].A == 0) {
        count += 1
        if (answer2.length == count) {
          isEnd = true

        }
      }
    }
    for (let i = 0; i < answer2.length; i++) {
      if (answer2[i].item == 0) {
        drawLine(ctx, answer2[i].moveToX, answer2[i].moveToY, answer2[i].lineToX, answer2[i].lineToY + answer2[i].A);
      } else {
        drawLine(ctx, answer2[i].moveToX, answer2[i].moveToY, answer2[i].lineToX + answer2[i].A, answer2[i].lineToY);
      }
    }
  }
  if (!isEnd) {
    ctx.lineWidth = 5; // 枠線の太さ
    ctx.strokeStyle = "#707070"; // 枠線の色
    ctx.strokeRect(68 * scaleX, 1395 * scaleY, 945 * scaleX, 242 * scaleY); // x, y, width, height
    ctx.fillStyle = 'red'
    ctx.font = `${240 * scaleY}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      '?'
      , 543 * scaleX, 1534 * scaleY
    );
  }
  // 画像を指定の位置とサイズで描画
  if (isEnd) {
    ctx.drawImage(img, (-20 + 240 * ClickItem) * scaleX, 1260 * scaleY, 385 * scaleX, 293 * scaleY); // (画像, x, y, 幅, 高さ)
    // フォントの設定
    ctx.font = `${36 * scaleY}px Arial`;
    ctx.textAlign = "center"; // 中央揃えに設定
    ctx.textBaseline = "middle"; // 基準線を中央に設定
    ctx.fillStyle = 'black'
    // 文字列と画像の中心座標

    const imageX = (-20 + 240 * ClickItem) * scaleX;
    const imageY = 1260 * scaleY;
    const imageWidth = 385 * scaleX;
    const imageHeight = 293 * scaleY;

    // 画像の中心位置を計算
    const centerX = imageX + imageWidth / 2;
    const centerY = imageY + imageHeight / 2;

    // 文字の描画

    ctx.font = `${40 * scaleY}px Arial`;
    ctx.fillText(atari, centerX, 1340 * scaleX);
    ctx.font = `${62 * scaleY}px Arial`;
    ctx.fillText(money, centerX, centerY)
    ctx.font = `${30 * scaleY}px Arial`;

    ctx.fillText(bonus, centerX, 1470 * scaleY)
    ctx.fillStyle = 'red'
    ctx.fillRect((-20 + 240 * ClickItem) * scaleX, 1563 * scaleY, 385 * scaleX, 293 * scaleY);
    rectX = (-20 + 240 * ClickItem) * scaleX
    rectY = 1563 * scaleY
    rectWidth = 385 * scaleX
    rectHeight = 293 * scaleY
    ctx.fillStyle = 'white'
    ctx.font = `${40 * scaleY}px Arial`;
    ctx.fillText(couponcode, centerX, 1600 * scaleX);
    ctx.font = `${42 * scaleY}px Arial`;
    ctx.fillText(inpu, centerX, 1700 * scaleY)
    ctx.font = `${42 * scaleY}px Arial`;
    ctx.fillText(get, centerX, 1800 * scaleY)
  }
  requestAnimationFrame(gameLoop); // 次のフレームを予約
}

// リサイズ時にキャンバスを再調整
window.addEventListener('resize', resizeCanvas);

// 初期化
resizeCanvas();
gameLoop();
