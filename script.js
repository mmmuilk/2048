const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
let grid = [];
let score = 0;

// Initialize the grid
function initializeGrid() {
  grid = Array(4)
    .fill()
    .map(() => Array(4).fill(0));
  addRandomTile();
  addRandomTile();
  renderGrid();
}

// Add a random tile (2 or 4)
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

// Render the grid
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

// Slide tiles in a given direction
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

// Handle move
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

// Rotate grid (transpose for vertical moves)
function rotateGrid(matrix, counterClockwise = false) {
  const rotated = matrix[0].map((_, colIndex) =>
    matrix.map(row => row[colIndex])
  );
  return counterClockwise ? rotated.map(row => row.reverse()) : rotated.reverse();
}

// Check game over
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

// Handle key press
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') move('up');
  if (e.key === 'ArrowDown') move('down');
  if (e.key === 'ArrowLeft') move('left');
  if (e.key === 'ArrowRight') move('right');
});

// Initialize the game
initializeGrid();