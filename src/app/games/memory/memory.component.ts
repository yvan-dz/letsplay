import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-memory',
  standalone: true,
  imports: [CommonModule], // CommonModule hier importieren
  template: `
    <h2>Memory Spiel</h2>
    <div class="memory-board">
      <div
        class="card"
        *ngFor="let card of cards"
        [class.flipped]="card.flipped || card.matched"
        (click)="flipCard(card)"
      >
        <div class="card-front">{{ card.image }}</div>
        <div class="card-back">❓</div>
      </div>
    </div>
    <p *ngIf="matches === cards.length / 2">🎉 Glückwunsch! Du hast alle Paare gefunden! 🎉</p>
  `,
  styles: [`
    .memory-board {
      display: grid;
      grid-template-columns: repeat(4, 100px);
      gap: 10px;
      justify-content: center;
      margin: 20px 0;
    }

    .card {
      width: 100px;
      height: 100px;
      position: relative;
      cursor: pointer;
      transform: perspective(600px) rotateY(0);
      transform-style: preserve-3d;
      transition: transform 0.5s;
    }

    .card.flipped {
      transform: perspective(600px) rotateY(180deg);
    }

    .card-front,
    .card-back {
      position: absolute;
      backface-visibility: hidden;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2rem;
      border-radius: 10px;
    }

    .card-front {
      background: #4caf50;
      color: white;
      transform: rotateY(180deg);
    }

    .card-back {
      background: #1e88e5;
      color: white;
    }
  `]
})
export class MemoryComponent implements OnInit {
  cards: { id: number; image: string; flipped: boolean; matched: boolean }[] = [];
  firstCard: any = null;
  secondCard: any = null;
  isChecking: boolean = false;
  matches: number = 0;

  ngOnInit(): void {
    this.initializeGame();
  }

  // Initialisiere das Spiel
  initializeGame() {
    const images = ['🍎', '🍌', '🍓', '🍇', '🍉', '🍍']; // Beispiel-Emojis
    const cardSet = [...images, ...images]; // Kartenpaare erstellen
    this.cards = this.shuffleCards(cardSet.map((image, index) => ({
      id: index,
      image,
      flipped: false,
      matched: false
    })));
  }

  // Karten mischen
  shuffleCards(cards: any[]): any[] {
    return cards.sort(() => Math.random() - 0.5);
  }

  // Karte umdrehen
  flipCard(card: any) {
    if (this.isChecking || card.flipped || card.matched) return; // Blockiert Klicks, wenn bereits geprüft wird

    card.flipped = true;

    if (!this.firstCard) {
      this.firstCard = card; // Erste Karte speichern
    } else {
      this.secondCard = card; // Zweite Karte speichern
      this.checkMatch(); // Paare prüfen
    }
  }

  // Prüfen, ob zwei Karten ein Paar sind
  checkMatch() {
    this.isChecking = true; // Blockiert weitere Klicks
    setTimeout(() => {
      if (this.firstCard.image === this.secondCard.image) {
        // Karten passen zusammen
        this.firstCard.matched = true;
        this.secondCard.matched = true;
        this.matches++;
      } else {
        // Karten passen nicht
        this.firstCard.flipped = false;
        this.secondCard.flipped = false;
      }
      // Zurücksetzen
      this.firstCard = null;
      this.secondCard = null;
      this.isChecking = false;
    }, 1000); // 1 Sekunde Verzögerung
  }
}
