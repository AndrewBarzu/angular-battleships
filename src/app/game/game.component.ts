import { Component, OnInit } from '@angular/core';
import {GameService} from '../game.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatButtonToggle} from '@angular/material/button-toggle';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  animations: [
    trigger('cellState', [
      state('none', style({
          backgroundColor: 'blue',
      })),
      state('miss', style({
        backgroundColor: 'white',
      })),
      state('hit', style({
        backgroundColor: 'red',
      })),
      state('ship', style({
        backgroundColor: 'blue',
      })),
      transition('none => miss', [
        animate('1s', style({
          backgroundColor: 'white',
        }))]),
      transition('none => hit', [
        animate('1s', style({
          backgroundColor: 'red',
        }))]),
      transition('ship => hit', [
        animate('1s', style({
          backgroundColor: 'red',
        }))]),
    ])
  ]
})
export class GameComponent implements OnInit {
  win: string;
  constructor(public gameService: GameService, public matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  hit(x: number, y: number): void{
    this.gameService.hit(x, y);
    if (this.gameService.ended()){
      if (this.gameService.winner()){
        this.openModal({class: 'win', text: 'You win!'});
      }
      else{
        this.openModal({class: 'lose', text: 'You lose :('});
      }
    }
  }

  openModal(message: {class: string, text: string}): void {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = 'dialog-component';
    dialogConfig.height = '350px';
    dialogConfig.width = '600px';
    console.log(message);
    const modalDialog = this.matDialog.open(DialogComponent, {
      disableClose: true,
      data: message,
    });
    modalDialog.afterClosed().subscribe(() => {
      this.gameService.replay();
    });
  }

}
