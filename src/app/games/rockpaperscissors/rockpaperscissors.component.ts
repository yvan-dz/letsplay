import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rockpaperscissors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Rock-Paper-Scissors</h2>
    <div class="game-area">
      <div class="choices">
        <button (click)="play('rock')">🪨 Stein</button>
        <button (click)="play('paper')">📄 Papier</button>
        <button (click)="play('scissors')">✂️ Schere</button>
      </div>
      <div class="results">
        <p>Deine Wahl: {{ playerChoice || 'Keine' }}</p>
        <p>Computerwahl: {{ computerChoice || 'Keine' }}</p>
        <p>Ergebnis: {{ result || 'Spiel läuft...' }}</p>
      </div>
    </div>
  `,
  styles: [`
    .game-area {
      text-align: center;
      font-family: Arial, sans-serif;
    }

    .choices button {
      margin: 10px;
      padding: 10px 20px;
      font-size: 1.2rem;
      cursor: pointer;
      border: 2px solid #333;
      border-radius: 5px;
      background-color: #f0f0f0;
      transition: background-color 0.3s ease;
    }

    .choices button:hover {
      background-color: #ddd;
    }

    .results p {
      font-size: 1.2rem;
      margin: 10px 0;
    }
  `]
})
export class RockPaperScissorsComponent {
  playerChoice: string | null = null;
  computerChoice: string | null = null;
  result: string | null = null;

  play(playerChoice: string) {
    this.playerChoice = playerChoice;
    this.computerChoice = this.getComputerChoice();
    this.result = this.determineWinner(this.playerChoice, this.computerChoice);
  }

  getComputerChoice(): string {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
  }

  determineWinner(player: string, computer: string): string {
    if (player === computer) {
      return 'Unentschieden!';
    }

    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'scissors' && computer === 'paper') ||
      (player === 'paper' && computer === 'rock')
    ) {
      return 'Du hast gewonnen! 🎉';
    }

    return 'Computer gewinnt! 😞';
  }
}
