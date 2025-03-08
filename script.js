const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
let grid = [];
let score = 0;

//谁家好人写代码不写注释
function initializeGrid() {
  grid = Array(4)
    .fill()
    .map(() => Array(4).fill(0));
  addRandomTile();
  addRandomTile();
  renderGrid();
}

function addRandomTile() {
  let emptyTiles = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === 0) {
        emptyTiles.push({ row, col });
      }
    }
  }
  if (emptyTiles.length > 0) {
    let { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    grid[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
}

function renderGrid() {
  gameBoard.innerHTML = '';
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      if (grid[row][col] > 0) {
        tile.textContent = grid[row][col];
        tile.dataset.value = grid[row][col];
      }
      gameBoard.appendChild(tile);
    }
  }
  scoreDisplay.textContent = `Score: ${score}`;
}

function slide(row) {
  let arr = row.filter(val => val);
  let merged = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[i + 1]) {
      merged.push(arr[i] * 2);
      score += arr[i] * 2;
      i++;
    } else {
      merged.push(arr[i]);
    }
  }
  while (merged.length < 4) {
    merged.push(0);
  }
  return merged;
}

function move(direction) {
  let rotated = false;
  if (direction === 'up' || direction === 'down') {
    grid = rotateGrid(grid);
    rotated = true;
  }
  if (direction === 'down' || direction === 'right') {
    grid = grid.map(row => row.reverse());
  }

  let newGrid = grid.map(row => slide(row));

  if (direction === 'down' || direction === 'right') {
    newGrid = newGrid.map(row => row.reverse());
  }
  if (rotated) {
    newGrid = rotateGrid(newGrid, true);
  }

  if (JSON.stringify(grid) !== JSON.stringify(newGrid)) {
    grid = newGrid;
    addRandomTile();
    renderGrid();
    if (checkGameOver()) {
      alert('Game Over!');
    }
  }
}

function rotateGrid(matrix, counterClockwise = false) {
  const rotated = matrix[0].map((_, colIndex) =>
    matrix.map(row => row[colIndex])
  );
  return counterClockwise ? rotated.map(row => row.reverse()) : rotated.reverse();
}

function checkGameOver() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === 0) return false;
      if (row < 3 && grid[row][col] === grid[row + 1][col]) return false;
      if (col < 3 && grid[row][col] === grid[row][col + 1]) return false;
    }
  }
  return true;
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') move('up');
  if (e.key === 'ArrowDown') move('down');
  if (e.key === 'ArrowLeft') move('left');
  if (e.key === 'ArrowRight') move('right');
});
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener("touchstart", function (e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", function (e) {
  touchEndX = e.changedTouches[0].clientX;
  touchEndY = e.changedTouches[0].clientY;
  handleSwipe();
});

//更新移动端。。滑
function handleSwipe() {
  let dx = touchEndX - touchStartX;
  let dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    // 左右滑动
    if (dx > 50) {
      move("right");
    } else if (dx < -50) {
      move("left");
    }
  } else {
    // 上下滑动
    if (dy > 50) {
      move("down");
    } else if (dy < -50) {
      move("up");
    }
  }
}

// Initialize the game
initializeGrid();
