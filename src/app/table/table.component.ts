import { Component, OnInit } from '@angular/core';


const sizes = {1: 2, 2: 3, 3: 4};
export {sizes};
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  size = 8;
  table = [];
  public hits = 0;
  orientations = {H: 'y', V: 'x'};
  constructor() {
    for (let i = 0; i < this.size; i++) {
      this.table[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.table[i][j] = {status: 'none', text: ' '};
      }
    }
  }

  ngOnInit(): void {}
  validate_placement(x: number, y: number, shipType: string, orientation: string): void {
    if (this.orientations[orientation] + sizes[shipType] > 8) {
      throw new Error('Ship does not fit');
    }
    for (let i = 0; i < sizes[shipType]; i++) {
      if (orientation === 'V') {
        if (this.table[x + i][y].status === 'ship') {
          throw new Error('Ship overlaps');
        }
      }
      else {
        if (this.table[x][y + i].status === 'ship') {
          throw new Error('Ship overlaps');
        }
      }
    }
  }

  public place(x: number, y: number, shipType: string, orientation: string): void {
    this.validate_placement(x, y, shipType, orientation);
    for (let i = 0; i < sizes[shipType]; i++) {
      if (orientation === 'V'){
        this.table[x + i][y].status = 'ship';
        this.table[x + i][y].text = '🚢';
      }
      else {
        this.table[x][y + i].status = 'ship';
        this.table[x][y + i].text = '🚢';
      }
    }
  }

  public hit(x: number, y: number): boolean{
    if (this.table[x][y].status === 'ship'){
      this.hits++;
      this.table[x][y].status = 'hit';
      this.table[x][y].text = '💀';
      return true;
    }
    if (this.table[x][y].status === 'none') {
      this.table[x][y].status = 'miss';
      this.table[x][y].text = '';
      return false;
    }
    throw new Error('Already attacked here');
  }

  displayForEnemy(): any{
    const table = [];
    for (let i = 0; i < this.size; i++) {
      table[i] = [];
      for (let j = 0; j < this.size; j++) {
        if (this.table[i][j].status !== 'ship') {
          table[i][j] = this.table[i][j];
        }
        else{
          table[i][j] = {status: 'none', text: ''};
        }
      }
    }
    return table;
  }

  displayForSelf(): any{
    return this.table;
  }
}
