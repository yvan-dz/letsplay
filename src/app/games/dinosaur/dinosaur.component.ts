import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dinosaur',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Dinosaur Game</h2>
    <div class="game-container">
      <div class="ground"></div>
      <div class="dino" [style.bottom.px]="dinoY"></div>
      <div
        *ngFor="let cactus of cacti"
        class="cactus"
        [style.right.px]="cactus.x"
        [style.top.px]="cactus.y"
      ></div>
    </div>
    <p>Punkte: {{ score }}</p>
    <button *ngIf="gameOver" (click)="restartGame()">Neustarten</button>
  `,
  styles: [`
    .game-container {
      position: relative;
      width: 800px;
      height: 200px;
      border: 2px solid black;
      overflow: hidden;
      margin: 20px auto;
      background-color: #f7f7f7;
    }

    .ground {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 20px;
      background-color: #444;
    }

    .dino {
      position: absolute;
      width: 40px;
      height: 40px;
      background-color: black;
      bottom: 20px;
      left: 50px;
    }

    .cactus {
      position: absolute;
      width: 20px;
      height: 40px;
      background-color: black;
    }

    h2 {
      text-align: center;
      font-family: Arial, sans-serif;
    }

    p {
      text-align: center;
      font-size: 1.2rem;
    }

    button {
      display: block;
      margin: 10px auto;
      padding: 10px 20px;
      font-size: 1rem;
      cursor: pointer;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #45a049;
    }
  `]
})
export class DinosaurComponent implements OnInit {
  dinoY = 20;
  isJumping = false;
  gravity = 2;
  jumpSpeed = 15;

  cacti: { x: number; y: number }[] = [];
  cactusInterval: any;
  gameInterval: any;
  speed = 3;

  score = 0;
  gameOver = false;

  ngOnInit(): void {
    this.startGame();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ' && !this.isJumping) {
      this.jump();
    }
  }

  startGame() {
    this.dinoY = 20;
    this.isJumping = false;
    this.score = 0;
    this.speed = 3;
    this.gameOver = false;

    this.cacti = [];
    this.generateCactus();

    this.gameInterval = setInterval(() => this.updateGame(), 20);
    this.cactusInterval = setInterval(() => this.generateCactus(), 3000); // Hindernisse erscheinen langsamer
  }

  jump() {
    this.isJumping = true;
    let jumpHeight = 0;
    const jumpInterval = setInterval(() => {
      if (jumpHeight >= 120) {
        clearInterval(jumpInterval);
        const fallInterval = setInterval(() => {
          if (this.dinoY <= 20) {
            this.dinoY = 20;
            this.isJumping = false;
            clearInterval(fallInterval);
          }
          this.dinoY -= this.gravity;
        }, 15);
      }
      this.dinoY += this.jumpSpeed;
      jumpHeight += this.jumpSpeed;
    }, 15);
  }

  generateCactus() {
    if (this.gameOver) return;
    const cactusX = 800; // Hindernis startet rechts
    const cactusY = 150; // Hindernis startet in der Nähe des Kreises
    this.cacti.push({ x: cactusX, y: cactusY });
  }

  updateGame() {
    this.score++;
    if (this.score % 500 === 0) {
      this.speed += 1; // Geschwindigkeit erhöht sich mit der Zeit
    }

    this.cacti.forEach((cactus, index) => {
      cactus.x -= this.speed; // Hindernis bewegt sich nach links
      cactus.y += this.speed / 2; // Hindernis bewegt sich leicht nach unten

      if (cactus.x < -20 || cactus.y > 180) {
        this.cacti.splice(index, 1); // Entferne Hindernisse, die den Bildschirm verlassen
      }

      // Prüfe auf Kollision
      if (
        cactus.x < 90 &&
        cactus.x > 50 &&
        cactus.y < 60 &&
        this.dinoY <= 60
      ) {
        this.endGame();
      }
    });
  }

  endGame() {
    clearInterval(this.gameInterval);
    clearInterval(this.cactusInterval);
    this.gameOver = true;
    alert(`Spiel vorbei! Dein Punktestand: ${this.score}`);
  }

  restartGame() {
    this.endGame();
    this.startGame();
  }
}
