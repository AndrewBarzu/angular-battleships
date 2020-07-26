import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  animations: [
    trigger('animate', [
      transition(':enter', [
        animate('1s fade-in'),
      ]),
      transition(':leave', [
        animate('1s fade-out'),
      ])
    ]),
  ],
})
export class DialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {class: string, text: string}
  ) { }

  ngOnInit(): void { }

  actionFunction(): void {
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
