import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snake',
  standalone: true,
  imports: [CommonModule], // Import für ngFor und ngIf
  template: `
    <h2>Snake Spiel</h2>
    <div class="snake-board">
      <div
        *ngFor="let cell of board; let i = index"
        [class.snake]="snake.includes(i)"
        [class.food]="food === i"
      ></div>
    </div>
    <p *ngIf="gameOver">💀 Spiel vorbei! Punkte: {{ score }} 💀</p>
    <p *ngIf="!gameOver">Punkte: {{ score }}</p>
  `,
  styles: [`
    .snake-board {
      display: grid;
      grid-template-columns: repeat(20, 20px); /* 20x20 Raster */
      gap: 1px;
      justify-content: center;
      margin: 20px auto;
      width: 420px;
      height: 420px;
      background-color: #ddd;
    }

    .snake-board div {
      width: 20px;
      height: 20px;
      background-color: #fff;
    }

    .snake {
      background-color: green; /* Farbe der Schlange */
    }

    .food {
      background-color: red; /* Farbe des Essens */
    }

    h2 {
      text-align: center;
      color: #333;
    }

    p {
      text-align: center;
      font-size: 1.2rem;
    }
  `]
})
export class SnakeComponent implements OnInit {
  board: number[] = Array(400).fill(0); // 20x20 Spielfeld
  snake: number[] = [42, 41, 40]; // Startposition der Schlange
  direction: string = 'RIGHT'; // Bewegungsrichtung
  food: number = 84; // Startposition des Essens
  score: number = 0;
  gameOver: boolean = false;

  interval: any;

  ngOnInit(): void {
    this.spawnFood(); // Essen generieren
    this.interval = setInterval(() => this.moveSnake(), 200); // Schlange bewegen
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        if (this.direction !== 'DOWN') this.direction = 'UP';
        break;
      case 'ArrowDown':
        if (this.direction !== 'UP') this.direction = 'DOWN';
        break;
      case 'ArrowLeft':
        if (this.direction !== 'RIGHT') this.direction = 'LEFT';
        break;
      case 'ArrowRight':
        if (this.direction !== 'LEFT') this.direction = 'RIGHT';
        break;
    }
  }

  moveSnake() {
    if (this.gameOver) return;

    const head = this.snake[0];
    let newHead;

    // Neue Position basierend auf der Richtung berechnen
    switch (this.direction) {
      case 'UP':
        newHead = head - 20;
        break;
      case 'DOWN':
        newHead = head + 20;
        break;
      case 'LEFT':
        newHead = head - 1;
        break;
      case 'RIGHT':
        newHead = head + 1;
        break;
      default:
        return;
    }

    // Kollision prüfen
    if (
      newHead < 0 || // Obere Wand
      newHead >= 400 || // Untere Wand
      (this.direction === 'LEFT' && head % 20 === 0) || // Linke Wand
      (this.direction === 'RIGHT' && head % 20 === 19) || // Rechte Wand
      this.snake.includes(newHead) // Kollision mit dem eigenen Körper
    ) {
      this.endGame();
      return;
    }

    // Essen fressen
    if (newHead === this.food) {
      this.score++;
      this.spawnFood();
    } else {
      this.snake.pop(); // Letztes Segment entfernen
    }

    this.snake.unshift(newHead); // Neues Kopfsegment hinzufügen
  }

  spawnFood() {
    let newFood;
    do {
      newFood = Math.floor(Math.random() * 400); // Zufällige Position
    } while (this.snake.includes(newFood)); // Stelle sicher, dass das Essen nicht auf der Schlange liegt
    this.food = newFood;
  }

  endGame() {
    clearInterval(this.interval);
    this.gameOver = true;
  }
}
