import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SnakeComponent } from './app/games/snake/snake.component';
import { TictactoeComponent } from './app/games/tictactoe/tictactoe.component';
import { MemoryComponent } from './app/games/memory/memory.component';
import { DoodleJumpComponent } from './app/games/doodlejump/doodlejump.component';
import { RockPaperScissorsComponent } from './app/games/rockpaperscissors/rockpaperscissors.component';
import { MinesweeperComponent } from './app/games/minesweeper/minesweeper.component';
import { DinosaurComponent } from './app/games/dinosaur/dinosaur.component';
import { CheckersComponent } from './app/games/checkers/checkers.component';
import { SpaceInvadersComponent } from './app/games/space-invaders/space-invaders.component';


const routes = [
  { path: '', component: AppComponent },
  { path: 'snake', component: SnakeComponent },
  { path: 'tictactoe', component: TictactoeComponent },
  { path: 'memory', component: MemoryComponent },
  { path: 'doodlejump', component: DoodleJumpComponent },
  { path: 'rockpaperscissors', component: RockPaperScissorsComponent },
  { path: 'minesweeper', component: MinesweeperComponent },
  { path: 'dinosaur', component: DinosaurComponent },
  { path: 'checkers', component: CheckersComponent },
  { path: 'space-invaders', component: SpaceInvadersComponent }

];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserModule),
  ],
}).catch(err => console.error(err));
