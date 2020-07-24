import {Component} from '@angular/core';
import { fader } from './route-transition-animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fader],
})
export class AppComponent{
  title = 'Battleships';
  constructor() {
  }
}
