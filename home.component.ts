import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <section class="hero">
      <h2>Erlebe die besten Retro-Arcade-Spiele!</h2>
      <p>Wähle ein Spiel und lass die Action beginnen!</p>
    </section>
  `,
  styles: [
    `
      .hero {
        padding: 50px;
        background: linear-gradient(to bottom, #000, #222);
        color: #fff;
        text-align: center;
        font-family: 'Press Start 2P', Arial, sans-serif;
      }
      .hero h2 {
        font-size: 2.5rem;
        text-shadow: 2px 2px #ff5722;
      }
      .hero p {
        font-size: 1.2rem;
        margin-top: 10px;
      }
    `,
  ],
})
export class HomeComponent {}
