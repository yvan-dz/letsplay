import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doodlejump',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Doodle Jump</h2>
    <div class="game-board" [style.transform]="'translateY(' + cameraOffset + 'px)'">
      <div class="player" [style.bottom.px]="playerY" [style.left.px]="playerX"></div>
      <div
        class="platform"
        *ngFor="let platform of platforms"
        [style.bottom.px]="platform.y"
        [style.left.px]="platform.x"
      ></div>
      <div
        class="enemy"
        *ngFor="let enemy of enemies"
        [style.bottom.px]="enemy.y"
        [style.left.px]="enemy.x"
      ></div>
    </div>
    <p>Punkte: {{ score }}</p>
    <button class="restart-btn" (click)="restartGame()">Spiel Neustarten</button>
  `,
  styles: [`
    .game-board {
      position: relative;
      width: 400px;
      height: 600px;
      border: 2px solid black;
      margin: 20px auto;
      overflow: hidden;
      background: linear-gradient(to bottom, #87ceeb, #f0f8ff);
      transition: transform 0.1s ease-out;
    }

    .player {
      position: absolute;
      width: 30px;
      height: 30px;
      background-color: red;
      border-radius: 50%;
    }

    .platform {
      position: absolute;
      width: 80px;
      height: 10px;
      background-color: green;
      border-radius: 5px;
    }

    .enemy {
      position: absolute;
      width: 30px;
      height: 30px;
      background-color: black;
      border-radius: 50%;
    }

    h2, p {
      text-align: center;
      font-family: Arial, sans-serif;
      margin: 10px 0;
    }

    .restart-btn {
      display: block;
      margin: 10px auto;
      padding: 10px 20px;
      font-size: 1rem;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .restart-btn:hover {
      background-color: #45a049;
    }
  `]
})
export class DoodleJumpComponent implements OnInit {
  // Spielfeld
  boardWidth = 400;
  boardHeight = 600;

  // Spieler
  playerX = 200;
  playerY = 100;
  playerVelocityY = 0;
  isJumping = false;

  // Kamera
  cameraOffset = 0;

  // Plattformen
  platforms: { x: number; y: number }[] = [];
  platformCount = 10;

  // Gegner
  enemies: { x: number; y: number }[] = [];
  enemySpawnScore = 500;

  // Punkte
  score = 0;

  // Spielintervall
  gameInterval: any;

  ngOnInit(): void {
    this.startGame();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.playerX = Math.max(this.playerX - 15, 0); // Spieler bewegt sich nach links
    } else if (event.key === 'ArrowRight') {
      this.playerX = Math.min(this.playerX + 15, this.boardWidth - 30); // Spieler bewegt sich nach rechts
    }
  }

  startGame() {
    this.initializePlatforms();
    this.initializeEnemies();
    this.score = 0;
    this.playerY = 100;
    this.playerVelocityY = 0;
    this.cameraOffset = 0;
    this.gameInterval = setInterval(() => this.updateGame(), 20); // Spiel aktualisieren
  }

  initializePlatforms() {
    this.platforms = [];
    for (let i = 0; i < this.platformCount; i++) {
      const yPosition = (i * this.boardHeight) / this.platformCount;
      const xPosition = Math.random() * (this.boardWidth - 80);
      this.platforms.push({ x: xPosition, y: yPosition });
    }
    // Garantiert eine Plattform unter dem Spieler zu Beginn
    this.platforms[0] = { x: this.playerX - 25, y: 50 };
  }

  initializeEnemies() {
    this.enemies = [];
  }

  updateGame() {
    // Schwerkraft anwenden
    this.playerVelocityY -= 0.4; // Spieler fällt
    this.playerY += this.playerVelocityY;

    // Spieler springt, wenn er auf einer Plattform landet
    this.platforms.forEach((platform) => {
      if (
        this.playerY > platform.y &&
        this.playerY < platform.y + 10 &&
        this.playerX + 30 > platform.x &&
        this.playerX < platform.x + 80 &&
        this.playerVelocityY < 0
      ) {
        this.playerVelocityY = 10; // Sprungkraft
        this.score += 10; // Punkte hinzufügen
        this.spawnEnemies(); // Gegner spawnen, falls nötig
      }
    });

    // Plattformen und Gegner nach unten bewegen
    if (this.playerY > this.boardHeight / 2) {
      const movement = this.playerVelocityY;
      this.cameraOffset += movement;

      this.platforms.forEach((platform) => {
        platform.y -= movement;
        if (platform.y < 0) {
          platform.y = this.boardHeight;
          platform.x = Math.random() * (this.boardWidth - 80); // Neue Position
        }
      });

      this.enemies.forEach((enemy) => {
        enemy.y -= movement;
        if (enemy.y < 0) {
          enemy.y = this.boardHeight;
          enemy.x = Math.random() * (this.boardWidth - 30);
        }
      });
    }

    // Prüfe Kollision mit Gegnern
    this.enemies.forEach((enemy) => {
      if (
        this.playerY > enemy.y &&
        this.playerY < enemy.y + 30 &&
        this.playerX + 30 > enemy.x &&
        this.playerX < enemy.x + 30
      ) {
        this.endGame();
      }
    });

    // Spielende prüfen
    if (this.playerY < 0) {
      this.endGame();
    }
  }

  spawnEnemies() {
    if (this.score >= this.enemySpawnScore && this.enemies.length < 5) {
      this.enemies.push({
        x: Math.random() * (this.boardWidth - 30),
        y: this.boardHeight,
      });
    }
  }

  endGame() {
    clearInterval(this.gameInterval);
    alert(`Spiel vorbei! Dein Punktestand: ${this.score}`);
  }

  restartGame() {
    clearInterval(this.gameInterval);
    this.startGame();
  }
}
