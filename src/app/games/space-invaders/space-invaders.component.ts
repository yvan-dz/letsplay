import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-space-invaders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>1942 Arcade Shooter</h2>
    <div class="game-container">
      <div class="player" [style.left.px]="playerX" [style.top.px]="playerY"></div>
      <div
        class="enemy"
        *ngFor="let enemy of enemies"
        [style.left.px]="enemy.x"
        [style.top.px]="enemy.y"
      ></div>
      <div
        class="bullet"
        *ngFor="let bullet of bullets"
        [style.left.px]="bullet.x"
        [style.top.px]="bullet.y"
      ></div>
      <div
        class="enemy-bullet"
        *ngFor="let bullet of enemyBullets"
        [style.left.px]="bullet.x"
        [style.top.px]="bullet.y"
      ></div>
    </div>
    <p>Punkte: {{ score }} | Highscore: {{ highscore }}</p>
    <p>{{ status }}</p>
    <button (click)="restartGame()">Neustarten</button>
    <p *ngIf="gameOver" style="color: red;">Spiel vorbei! Drücke "Neustarten".</p>
  `,
  styles: [
    `
      .game-container {
        position: relative;
        width: 600px;
        height: 800px;
        background: linear-gradient(to bottom, #001f3f, #001d3d);
        border: 2px solid white;
        margin: 0 auto;
        overflow: hidden;
      }
      .player {
        position: absolute;
        width: 50px;
        height: 50px;
        background-color: white;
        border-radius: 50%;
        background-image: url('https://cdn-icons-png.flaticon.com/128/9953/9953778.png');
        background-size: cover;
      }
      .enemy {
        position: absolute;
        width: 40px;
        height: 40px;
        background-color: red;
        border-radius: 50%;
        background-image: url('https://cdn-icons-png.flaticon.com/128/12942/12942473.png');
        background-size: cover;
      }
      .bullet {
        position: absolute;
        width: 5px;
        height: 15px;
        background-color: yellow;
      }
      .enemy-bullet {
        position: absolute;
        width: 5px;
        height: 15px;
        background-color: green;
      }
    `,
  ],
})
export class SpaceInvadersComponent implements OnInit {
  playerX: number = 275; // Spieler X-Position
  playerY: number = 700; // Spieler Y-Position
  bullets: { x: number; y: number }[] = [];
  enemies: { x: number; y: number }[] = [];
  enemyBullets: { x: number; y: number }[] = [];
  score: number = 0;
  highscore: number = 0;
  gameOver: boolean = false;
  status: string = 'Spiel gestartet!';

  private spawnInterval: any;
  private moveInterval: any;
  private enemyFireInterval: any;
  private bulletInterval: any;

  ngOnInit(): void {
    this.spawnEnemies();
    this.enemyFire();
    this.autoFire();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' && this.playerX > 0) {
      this.playerX -= 15;
    } else if (event.key === 'ArrowRight' && this.playerX < 550) {
      this.playerX += 15;
    } else if (event.key === 'ArrowUp' && this.playerY > 650) {
      this.playerY -= 15;
    } else if (event.key === 'ArrowDown' && this.playerY < 750) {
      this.playerY += 15;
    }
  }

  autoFire() {
    this.bulletInterval = setInterval(() => {
      if (this.gameOver) {
        clearInterval(this.bulletInterval);
        return;
      }
      this.bullets.push({ x: this.playerX + 22, y: this.playerY });
      this.moveBullets();
    }, 500);
  }

  moveBullets() {
    const interval = setInterval(() => {
      if (this.gameOver) {
        clearInterval(interval);
        return;
      }
      this.bullets.forEach((bullet, index) => {
        bullet.y -= 8;
        if (bullet.y < 0) {
          this.bullets.splice(index, 1);
        }
        this.checkCollision(index);
      });
    }, 50);
  }

  spawnEnemies() {
    this.spawnInterval = setInterval(() => {
      if (this.gameOver) {
        clearInterval(this.spawnInterval);
        return;
      }
      const xPosition = Math.floor(Math.random() * 560);
      this.enemies.push({ x: xPosition, y: 10 });
    }, 2000);
    this.moveEnemies();
  }

  moveEnemies() {
    this.moveInterval = setInterval(() => {
      if (this.gameOver) {
        clearInterval(this.moveInterval);
        return;
      }
      this.enemies.forEach((enemy, index) => {
        enemy.y += 2;
        if (enemy.y > 750) {
          this.endGame(false);
        }
      });
    }, 100);
  }

  enemyFire() {
    this.enemyFireInterval = setInterval(() => {
      if (this.gameOver) {
        clearInterval(this.enemyFireInterval);
        return;
      }
      if (this.enemies.length > 0) {
        const randomEnemy =
          this.enemies[Math.floor(Math.random() * this.enemies.length)];
        this.enemyBullets.push({ x: randomEnemy.x + 20, y: randomEnemy.y + 40 });
        this.moveEnemyBullets();
      }
    }, 3000);
  }

  moveEnemyBullets() {
    const interval = setInterval(() => {
      if (this.gameOver) {
        clearInterval(interval);
        return;
      }
      this.enemyBullets.forEach((bullet, index) => {
        bullet.y += 4;
        if (bullet.y > 800) {
          this.enemyBullets.splice(index, 1);
        }
        this.checkPlayerHit(bullet);
      });
    }, 100);
  }

  checkCollision(bulletIndex: number) {
    this.enemies.forEach((enemy, index) => {
      const bullet = this.bullets[bulletIndex];
      if (
        bullet.x >= enemy.x &&
        bullet.x <= enemy.x + 40 &&
        bullet.y <= enemy.y + 40 &&
        bullet.y >= enemy.y
      ) {
        this.enemies.splice(index, 1);
        this.bullets.splice(bulletIndex, 1);
        this.score += 10;
      }
    });
  }

  checkPlayerHit(bullet: { x: number; y: number }) {
    if (
      bullet.x >= this.playerX &&
      bullet.x <= this.playerX + 50 &&
      bullet.y >= this.playerY &&
      bullet.y <= this.playerY + 50
    ) {
      this.endGame(false);
    }
  }

  restartGame() {
    this.playerX = 275;
    this.playerY = 700;
    this.bullets = [];
    this.enemies = [];
    this.enemyBullets = [];
    this.score = 0;
    this.gameOver = false;
    this.status = 'Spiel gestartet!';
    clearInterval(this.spawnInterval);
    clearInterval(this.moveInterval);
    clearInterval(this.enemyFireInterval);
    clearInterval(this.bulletInterval);
    this.spawnEnemies();
    this.enemyFire();
    this.autoFire();
  }

  endGame(victory: boolean = false) {
    this.gameOver = true;
    this.status = victory ? 'Du hast gewonnen!' : 'Spiel vorbei!';
    if (this.score > this.highscore) {
      this.highscore = this.score;
    }
  }
}
