import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-minesweeper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Minesweeper</h2>

    <section class="rules">
  <h3>Spielregeln</h3>
  <ul>
    <li>Das Spielfeld enthält versteckte Bomben.</li>
    <li>Klicke auf ein Feld, um es aufzudecken.</li>
    <li>Zahlen zeigen an, wie viele Bomben sich in den angrenzenden Feldern befinden.</li>
    <li>Vermeide die Bomben, um das Spiel zu gewinnen.</li>
    <li>Das Spiel endet, wenn du eine Bombe triffst.</li>
  </ul>
</section>

    <div class="board">
      <div
        class="cell"
        *ngFor="let cell of board; let i = index"
        [class.revealed]="cell.revealed"
        [class.bomb]="cell.revealed && cell.isBomb"
        [class.safe]="cell.revealed && !cell.isBomb"
        (click)="revealCell(i)"
      >
        {{ cell.revealed && cell.isBomb ? '💣' : cell.revealed && cell.adjacentBombs > 0 ? cell.adjacentBombs : '' }}
      </div>
    </div>
    <p *ngIf="gameOver" class="game-over">Spiel vorbei!</p>
    <button (click)="restartGame()">Neustarten</button>
  `,
  styles: [`
    .board {
      display: grid;
      grid-template-columns: repeat(10, 40px);
      gap: 2px;
      margin: 20px auto;
      width: 420px;
    }
    .rules {
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin: 20px auto;
  max-width: 400px;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.rules h3 {
  text-align: center;
  margin-bottom: 10px;
  font-size: 1.2rem;
  color: #444;
}

.rules ul {
  list-style: disc;
  padding-left: 20px;
  color: #555;
  font-size: 0.9rem;
}

.rules ul li {
  margin-bottom: 8px;
}

    .cell {
      width: 40px;
      height: 40px;
      border: 1px solid #333;
      background-color: #ccc;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.2rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .cell.revealed {
      background-color: #eee;
      cursor: default;
    }

    .cell.bomb {
      background-color: red;
      color: white;
    }

    .cell.safe {
      background-color: #8fbc8f;
      color: black;
    }

    h2 {
      text-align: center;
    }

    .game-over {
      text-align: center;
      color: red;
      font-size: 1.5rem;
    }

    button {
      display: block;
      margin: 10px auto;
      padding: 10px 20px;
      font-size: 1rem;
      cursor: pointer;
    }
  `]
})
export class MinesweeperComponent implements OnInit {
  board: Cell[] = [];
  rows = 10;
  cols = 10;
  bombCount = 20;
  gameOver = false;

  ngOnInit(): void {
    this.startGame();
  }

  startGame() {
    this.board = this.generateBoard();
    this.placeBombs();
    this.calculateAdjacentBombs();
    this.gameOver = false;
  }

  generateBoard(): Cell[] {
    return Array.from({ length: this.rows * this.cols }, () => ({
      isBomb: false,
      revealed: false,
      adjacentBombs: 0,
    }));
  }

  placeBombs() {
    let bombsPlaced = 0;
    while (bombsPlaced < this.bombCount) {
      const index = Math.floor(Math.random() * this.board.length);
      if (!this.board[index].isBomb) {
        this.board[index].isBomb = true;
        bombsPlaced++;
      }
    }
  }

  calculateAdjacentBombs() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const index = this.getIndex(row, col);
        if (!this.board[index].isBomb) {
          this.board[index].adjacentBombs = this.getAdjacentCells(row, col).filter(
            (i) => this.board[i].isBomb
          ).length;
        }
      }
    }
  }

  revealCell(index: number) {
    if (this.gameOver || this.board[index].revealed) return;

    const cell = this.board[index];
    cell.revealed = true;

    if (cell.isBomb) {
      this.gameOver = true;
      alert('Spiel vorbei! Du hast eine Bombe getroffen.');
      return;
    }

    if (cell.adjacentBombs === 0) {
      const row = Math.floor(index / this.cols);
      const col = index % this.cols;
      this.getAdjacentCells(row, col).forEach((i) => this.revealCell(i));
    }
  }

  getAdjacentCells(row: number, col: number): number[] {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1], // oben
      [0, -1], /*   */ [0, 1],   // links, rechts
      [1, -1], [1, 0], [1, 1],   // unten
    ];

    return directions
      .map(([dr, dc]) => [row + dr, col + dc])
      .filter(([r, c]) => r >= 0 && r < this.rows && c >= 0 && c < this.cols)
      .map(([r, c]) => this.getIndex(r, c));
  }

  getIndex(row: number, col: number): number {
    return row * this.cols + col;
  }

  restartGame() {
    this.startGame();
  }
}

interface Cell {
  isBomb: boolean;
  revealed: boolean;
  adjacentBombs: number;
}
