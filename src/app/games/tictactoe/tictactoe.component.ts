import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tictactoe',
  standalone: true,
  imports: [CommonModule], // CommonModule für ngIf und ngFor
  template: `
    <h2>Tic Tac Toe</h2>
    <div class="board">
      <div
        class="cell"
        *ngFor="let cell of board; let i = index"
        [class.x]="cell === 'X'"
        [class.o]="cell === 'O'"
        (click)="makeMove(i)"
      >
        {{ cell }}
      </div>
    </div>
    <p *ngIf="winner">{{ winner === 'Draw' ? 'Unentschieden!' : winner + ' hat gewonnen!' }}</p>
    <button (click)="resetGame()">Spiel Neustarten</button>
  `,
  styles: [`
    .board {
      display: grid;
      grid-template-columns: repeat(3, 100px);
      gap: 5px;
      margin: 20px auto;
      width: 315px;
    }

    .cell {
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2rem;
      border: 1px solid #333;
      cursor: pointer;
    }

    .cell.x {
      color: blue;
    }

    .cell.o {
      color: red;
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
export class TictactoeComponent {
  board: (string | null)[] = Array(9).fill(null); // Spielfeld
  currentPlayer: 'X' | 'O' = 'X'; // Startspieler
  winner: string | null = null;

  makeMove(index: number) {
    if (this.board[index] || this.winner) return; // Blockiert Züge, wenn das Feld belegt ist oder das Spiel vorbei ist

    this.board[index] = this.currentPlayer;

    // Überprüfe auf einen Gewinner
    if (this.checkWinner()) {
      this.winner = this.currentPlayer;
      return;
    }

    // Wechsel zum nächsten Spieler (AI-Zug, wenn X fertig ist)
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

    if (this.currentPlayer === 'O') {
      this.aiMove(); // AI macht ihren Zug
    }
  }

  aiMove() {
    const bestMove = this.findBestMove();
    if (bestMove !== null) {
      this.board[bestMove] = 'O';

      // Überprüfe auf einen Gewinner
      if (this.checkWinner()) {
        this.winner = 'O';
        return;
      }

      // Zurück zu Spieler X
      this.currentPlayer = 'X';
    }
  }

  findBestMove(): number | null {
    let bestScore = -Infinity;
    let bestMove: number | null = null;

    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] === null) {
        this.board[i] = 'O'; // Temporärer Zug der AI
        const score = this.minimax(0, false);
        this.board[i] = null; // Rückgängig machen

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  }

  minimax(depth: number, isMaximizing: boolean): number {
    const winner = this.checkWinnerForAI();
    if (winner === 'O') return 10 - depth; // AI gewinnt
    if (winner === 'X') return depth - 10; // Spieler gewinnt
    if (!this.board.includes(null)) return 0; // Unentschieden

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < this.board.length; i++) {
        if (this.board[i] === null) {
          this.board[i] = 'O';
          const score = this.minimax(depth + 1, false);
          this.board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < this.board.length; i++) {
        if (this.board[i] === null) {
          this.board[i] = 'X';
          const score = this.minimax(depth + 1, true);
          this.board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  checkWinner(): boolean {
    const winningCombinations = [
      [0, 1, 2], // Reihen
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6], // Spalten
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8], // Diagonalen
      [2, 4, 6],
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return true; // Es gibt einen Gewinner
      }
    }

    return false;
  }

  checkWinnerForAI(): string | null {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return this.board[a];
      }
    }

    return null;
  }

  resetGame() {
    this.board = Array(9).fill(null); // Spielfeld zurücksetzen
    this.currentPlayer = 'X'; // Spieler X beginnt
    this.winner = null; // Gewinner zurücksetzen
  }
}
