import { Component, OnInit } from '@angular/core';
import {GameService} from '../game.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
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
