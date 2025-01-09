import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-racing-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>🏎️ Racing Game</h2>
    <div class="game-container">
      <div class="player" [style.left.px]="playerX" [style.top.px]="playerY"></div>
      <div
        class="obstacle"
        *ngFor="let obstacle of obstacles"
        [style.left.px]="obstacle.x"
        [style.top.px]="obstacle.y"
      ></div>
      <div
        class="coin"
        *ngFor="let coin of coins"
        [style.left.px]="coin.x"
        [style.top.px]="coin.y"
      ></div>
    </div>
    <div class="info-panel">
      <p>Punkte: {{ score }} | Highscore: {{ highscore }}</p>
      <p>{{ status }}</p>
      <button (click)="restartGame()">Neustarten</button>
    </div>
    <p *ngIf="gameOver" class="game-over">Spiel vorbei! Drücke "Neustarten".</p>
  `,
  styles: [
    `
      .game-container {
        position: relative;
        width: 500px;
        height: 800px;
        background: linear-gradient(to bottom, #4a4a4a, #2b2b2b);
        border: 3px solid white;
        margin: 20px auto;
        overflow: hidden;
        border-radius: 10px;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.6);
      }
  
      .player {
        position: absolute;
        width: 50px;
        height: 90px;
        background-image: url('https://cdn-icons-png.flaticon.com/128/12689/12689302.png');
        background-size: contain;
        background-repeat: no-repeat;
      }
  
      .obstacle {
        position: absolute;
        width: 50px;
        height: 90px;
        background-image: url('https://cdn-icons-png.flaticon.com/128/810/810035.png');
        background-size: contain;
        background-repeat: no-repeat;
      }
  
      .coin {
        position: absolute;
        width: 30px;
        height: 30px;
        background-image: url('https://cdn-icons-png.flaticon.com/128/15323/15323844.png');
        background-size: contain;
        background-repeat: no-repeat;
      }
  
      .info-panel {
        text-align: center;
        font-family: Arial, sans-serif;
        color: #fff;
        margin-top: 10px;
      }
  
      .info-panel p {
        margin: 5px 0;
        font-size: 18px;
      }
  
      .game-over {
        color: red;
        font-weight: bold;
        text-align: center;
        font-size: 20px;
      }
  
      button {
        padding: 12px 25px;
        border: none;
        background: #ff6f61;
        color: #fff;
        font-size: 18px;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;
      }
  
      button:hover {
        background: #ff856e;
      }
    `,
  ],
  
})
export class RacingGameComponent implements OnInit {
  playerX: number = 225; // Angepasste Startposition (zentriert für größeres Spielfeld)
  playerY: number = 700; // Vertikale Position angepasst
  obstacles: { x: number; y: number }[] = [];
  coins: { x: number; y: number }[] = [];
  score: number = 0;
  highscore: number = 0;
  gameOver: boolean = false;
  status: string = 'Spiel gestartet!';

  private obstacleInterval: any;
  private coinInterval: any;
  private moveElementsInterval: any;

  ngOnInit(): void {
    this.spawnObstacles();
    this.spawnCoins();
    this.moveElements();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameOver) return;
    if (event.key === 'ArrowLeft' && this.playerX > 0) {
      this.playerX -= 15;
    } else if (event.key === 'ArrowRight' && this.playerX < 450) { // Breiteres Spielfeld
      this.playerX += 15;
    } else if (event.key === 'ArrowUp' && this.playerY > 0) {
      this.playerY -= 15;
    } else if (event.key === 'ArrowDown' && this.playerY < 710) { // Höheres Spielfeld
      this.playerY += 15;
    }
  }

  spawnObstacles() {
    this.obstacleInterval = setInterval(() => {
      if (this.gameOver) {
        clearInterval(this.obstacleInterval);
        return;
      }
      const xPosition = Math.floor(Math.random() * 450); // Breiterer Spawnbereich
      this.obstacles.push({ x: xPosition, y: -90 });
    }, 2000);
  }

  spawnCoins() {
    this.coinInterval = setInterval(() => {
      if (this.gameOver) {
        clearInterval(this.coinInterval);
        return;
      }
      const xPosition = Math.floor(Math.random() * 470); // Breiterer Spawnbereich
      this.coins.push({ x: xPosition, y: -40 });
    }, 3000);
  }

  moveElements() {
    this.moveElementsInterval = setInterval(() => {
      if (this.gameOver) {
        clearInterval(this.moveElementsInterval);
        return;
      }

      // Hindernisse bewegen
      this.obstacles.forEach((obstacle, index) => {
        obstacle.y += 6;
        if (obstacle.y > 800) {
          this.obstacles.splice(index, 1);
        }
        this.checkCollision(obstacle);
      });

      // Münzen bewegen
      this.coins.forEach((coin, index) => {
        coin.y += 6;
        if (coin.y > 800) {
          this.coins.splice(index, 1);
        }
        this.collectCoin(coin, index);
      });
    }, 50);
  }

  checkCollision(obstacle: { x: number; y: number }) {
    if (
      this.playerX < obstacle.x + 50 &&
      this.playerX + 50 > obstacle.x &&
      this.playerY < obstacle.y + 90 &&
      this.playerY + 90 > obstacle.y
    ) {
      this.endGame();
    }
  }

  collectCoin(coin: { x: number; y: number }, index: number) {
    if (
      this.playerX < coin.x + 30 &&
      this.playerX + 50 > coin.x &&
      this.playerY < coin.y + 30 &&
      this.playerY + 90 > coin.y
    ) {
      this.coins.splice(index, 1);
      this.score += 10;
    }
  }

  restartGame() {
    this.playerX = 225;
    this.playerY = 700;
    this.obstacles = [];
    this.coins = [];
    this.score = 0;
    this.gameOver = false;
    this.status = 'Spiel gestartet!';
    clearInterval(this.obstacleInterval);
    clearInterval(this.coinInterval);
    clearInterval(this.moveElementsInterval);
    this.spawnObstacles();
    this.spawnCoins();
    this.moveElements();
  }

  endGame() {
    this.gameOver = true;
    this.status = 'Spiel vorbei!';
    if (this.score > this.highscore) {
      this.highscore = this.score;
    }
    clearInterval(this.obstacleInterval);
    clearInterval(this.coinInterval);
    clearInterval(this.moveElementsInterval);
  }
}
