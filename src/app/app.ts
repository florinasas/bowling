import {Component} from '@angular/core';
import {GameComponent} from './game/game.component';


@Component({
  selector: 'app-root',
  imports: [GameComponent],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})

export class App {}
