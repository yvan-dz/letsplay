import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Checkers Game</h2>
    <button (click)="resetGame()">Spiel Neustarten</button>
    <div class="board">
      <div *ngFor="let row of board; let rowIndex = index" class="row">
        <div
          *ngFor="let cell of row; let colIndex = index"
          class="cell"
          [class.black]="(rowIndex + colIndex) % 2 === 1"
          [class.white]="(rowIndex + colIndex) % 2 === 0"
          (click)="makeMove(rowIndex, colIndex)"
        >
          <div *ngIf="cell === 'W'" class="piece white-piece"></div>
          <div *ngIf="cell === 'B'" class="piece black-piece"></div>
          <div *ngIf="cell === 'WK'" class="piece white-king"></div>
          <div *ngIf="cell === 'BK'" class="piece black-king"></div>
        </div>
      </div>
    </div>
    <p>{{ status }}</p>
  `,
  styles: [`
    .board {
      display: grid;
      grid-template-rows: repeat(8, 1fr);
      grid-template-columns: repeat(8, 1fr);
      width: 500px;
      height: 500px;
      border: 3px solid #444;
      margin: 20px auto;
      background-color: #333;
    }

    .cell {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .black {
      background-color: #000;
    }

    .white {
      background-color: #eaeaea;
    }

    .piece {
      width: 60%;
      height: 60%;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
    }

    .white-piece {
      background-color: #fff;
      border: 2px solid #000;
    }

    .black-piece {
      background-color: #000;
      border: 2px solid #fff;
    }

    .white-king {
      background-color: #fff;
      border: 2px solid #000;
      font-size: 14px;
      font-weight: bold;
    }

    .black-king {
      background-color: #000;
      color: #fff;
      border: 2px solid #fff;
      font-size: 14px;
      font-weight: bold;
    }

    h2 {
      text-align: center;
      font-family: Arial, sans-serif;
      color: #444;
    }

    p {
      text-align: center;
      font-size: 1.2rem;
      color: #555;
    }

    button {
      display: block;
      margin: 10px auto;
      padding: 10px 20px;
      font-size: 16px;
      background-color: #555;
      color: white;
      border: none;
      cursor: pointer;
    }

    button:hover {
      background-color: #777;
    }
  `],
})
export class CheckersComponent implements OnInit {
  board: string[][] = [];
  currentPlayer: 'W' | 'B' = 'W';
  selectedPiece: { row: number; col: number } | null = null;
  status: string = 'Weiß ist dran';
  isPlayerTurn: boolean = true;

  ngOnInit(): void {
    this.initializeBoard();
  }

  initializeBoard(): void {
    this.board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(''));

    // Weiße Figuren
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 1) {
          this.board[i][j] = 'W';
        }
      }
    }

    // Schwarze Figuren
    for (let i = 5; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 1) {
          this.board[i][j] = 'B';
        }
      }
    }
  }

  resetGame(): void {
    this.initializeBoard();
    this.currentPlayer = 'W';
    this.isPlayerTurn = true;
    this.status = 'Weiß ist dran';
  }

  makeMove(row: number, col: number): void {
    if (this.currentPlayer === 'W' && this.isPlayerTurn) {
      if (this.selectedPiece) {
        if (this.isValidMove(this.selectedPiece.row, this.selectedPiece.col, row, col)) {
          const wasJump = this.isJumpMove(this.selectedPiece.row, this.selectedPiece.col, row, col);
          this.movePiece(this.selectedPiece.row, this.selectedPiece.col, row, col);
          this.selectedPiece = null;

          if (wasJump && this.canJump(row, col)) {
            this.selectedPiece = { row, col };
            this.status = 'Du kannst noch einmal schlagen.';
            return;
          }

          this.switchPlayer();
          this.isPlayerTurn = false;
          setTimeout(() => this.aiMove(), 1000);
        } else {
          this.status = 'Ungültiger Zug. Wähle ein gültiges Feld.';
          this.selectedPiece = null;
        }
      } else if (this.board[row][col] === 'W') {
        this.selectedPiece = { row, col };
        this.status = `Figur ausgewählt: (${row}, ${col})`;
      } else {
        this.status = 'Wähle deine eigene Figur aus.';
      }
    }
  }

  aiMove(): void {
    const possibleMoves: { fromRow: number; fromCol: number; toRow: number; toCol: number }[] = [];

    // Sammle alle möglichen Züge der KI
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === 'B') {
          const directions = this.getMoveDirections();
          for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (this.isValidMove(row, col, newRow, newCol)) {
              possibleMoves.push({ fromRow: row, fromCol: col, toRow: newRow, toCol: newCol });
            }
          }
        }
      }
    }

    // Priorisiere Sprungbewegungen
    const jumpMoves = possibleMoves.filter(move => this.isJumpMove(move.fromRow, move.fromCol, move.toRow, move.toCol));
    const chosenMove = jumpMoves.length > 0 ? jumpMoves[0] : possibleMoves[0];

    if (chosenMove) {
      this.movePiece(chosenMove.fromRow, chosenMove.fromCol, chosenMove.toRow, chosenMove.toCol);
      if (!this.canJump(chosenMove.toRow, chosenMove.toCol)) {
        this.switchPlayer();
        this.isPlayerTurn = true;
      } else {
        setTimeout(() => this.aiMove(), 1000);
      }
    } else {
      this.status = 'Weiß gewinnt! Kein gültiger Zug für Schwarz.';
    }
  }

  isValidMove(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return false;
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);

    if (colDiff !== Math.abs(rowDiff)) return false;

    if (colDiff === 1 && this.board[toRow][toCol] === '') {
      if (this.currentPlayer === 'W' && rowDiff === 1) return true;
      if (this.currentPlayer === 'B' && rowDiff === -1) return true;
    }

    if (colDiff === 2) {
      const jumpedRow = (fromRow + toRow) / 2;
      const jumpedCol = (fromCol + toCol) / 2;
      if (this.board[jumpedRow][jumpedCol] && this.board[jumpedRow][jumpedCol][0] !== this.currentPlayer && this.board[toRow][toCol] === '') return true;
    }

    return false;
  }

  movePiece(fromRow: number, fromCol: number, toRow: number, toCol: number): void {
    if (this.isJumpMove(fromRow, fromCol, toRow, toCol)) {
      const jumpedRow = (fromRow + toRow) / 2;
      const jumpedCol = (fromCol + toCol) / 2;
      this.board[jumpedRow][jumpedCol] = '';
    }

    this.board[toRow][toCol] = this.board[fromRow][fromCol];
    this.board[fromRow][fromCol] = '';

    if (toRow === 0 && this.board[toRow][toCol] === 'B') this.board[toRow][toCol] = 'BK';
    if (toRow === 7 && this.board[toRow][toCol] === 'W') this.board[toRow][toCol] = 'WK';
  }

  isJumpMove(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    return Math.abs(fromRow - toRow) === 2;
  }

  canJump(row: number, col: number): boolean {
    const directions = [
      [-2, -2],
      [-2, 2],
      [2, -2],
      [2, 2],
    ];
    return directions.some(([dr, dc]) =>
      this.isValidMove(row, col, row + dr, col + dc)
    );
  }

  getMoveDirections(): number[][] {
    return [
      [-1, -1],
      [-1, 1],
      [-2, -2],
      [-2, 2],
    ];
  }

  switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === 'W' ? 'B' : 'W';
    this.status = this.currentPlayer === 'W' ? 'Weiß ist dran' : 'Schwarz ist dran';
  }
}
