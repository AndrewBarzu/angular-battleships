import { Injectable } from '@angular/core';
import {TableComponent} from './table/table.component';
import {AiService} from './ai.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  boards: TableComponent[] = [];
  orientations: string[] = ['H', 'H'];
  phase = 'place';
  ships: number[] = [1, 1];
  error = '';
  AiPlayer: AiService;
  constructor() {
    this.boards[0] = new TableComponent();
    this.boards[1] = new TableComponent();
    this.AiPlayer = new AiService(this.boards[1], this.boards[0]);
    this.AiPlayer.place();
  }
  place(x: number, y: number, shipType: string, orientation: string): void{
    if (this.phase === 'game') {
      return;
    }
    try {
      this.boards[0].place(x, y, shipType, orientation);
    }
    catch (e) {
      this.error = e;
      return;
    }
    this.error = '';
    if (this.ships[0] === 3)
    {
      this.phase = 'game';
      return;
    }
    this.ships[0]++;
  }
  hit(x: number, y: number): void{
    try {
      this.boards[1].hit(x, y);
      this.AiPlayer.takeShot();
      // if (this.ended() === true){
      //   this.route.navigate(['/endScreen', this.winner() ? 'win' : 'lose']);
      //   this.error = this.winner() ? 'You win!' : 'You lose :(';
      // }
    }
    catch (e) {
      this.error = e;
    }
  }
  winner(): boolean{
    return this.boards[1].hits >= 9;
  }
  ended(): boolean{
    return (this.boards[0].hits >= 9 || this.boards[1].hits >= 9);
  }
  replay(): void{
    this.boards[0] = new TableComponent();
    this.boards[1] = new TableComponent();
    this.AiPlayer = new AiService(this.boards[1], this.boards[0]);
    this.AiPlayer.place();
    this.phase = 'place';
    this.ships = [1, 1];
  }
}
