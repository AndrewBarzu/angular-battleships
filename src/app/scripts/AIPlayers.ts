import {TableComponent} from '../table/table.component';
import {Stack} from 'stack-typescript';

export abstract class AIPlayer {
  protected probabilityMap = [];

  protected constructor(protected myTable: TableComponent, protected enemyTable: TableComponent) {
    for (let i = 0; i < 8; i++) {
      this.probabilityMap[i] = [];
      for (let j = 0; j < 8; j++) {
        this.probabilityMap[i][j] = 0;
      }
    }
  }
  abstract takeShot(): void;
  place(): void {
    for (let ship = 1; ship <= 3; ship++) {
      while (true) {
        try {
          const x = Math.floor(Math.random() * 8);
          const y = Math.floor(Math.random() * 8);
          const orientation = Math.floor(Math.random() * 2) === 1 ? 'H' : 'V';
          this.myTable.place(x, y, ship.toString(), orientation);
          break;
        } catch (e) {
        }
      }
    }
  }
}

export class HardAI extends AIPlayer{

  probabilityMap = [];
  shipQuotas;
  quota = 2;
  xquota = 5;
  morexQuota = 16;

  constructor(myTable: TableComponent, enemyTable: TableComponent) {
    super(myTable, enemyTable);
    this.shipQuotas = {2: 4, 3: 2, 4: 9};
  }
  /// Checks if an index is valid
  private validIndex(index: number): boolean {
    return 0 <= index && index < 64;
  }

  /// Function that fits a ship on the map
  fitShip(x: number, y: number, ship: any, mainQuota: number, xquota: number, morexQuota: number): void {
    const myQuotas = {2: 7.4, 3: 4.7, 4: 3.5};
    const enemyTable = this.enemyTable.displayForEnemy();
    if (x < 8 && y + ship - 1 < 8) {
      let count = 0;
      let quota = mainQuota;
      let xcount = 0;
      for (let i = 0; i < ship; i++) {
        if ((enemyTable[x][y + i]).status === 'miss') {
          this.probabilityMap[x][y + i] = 0;
          break;
        }
        if ((enemyTable[x][y + i]).status === 'hit') {
          xcount += 1;
          quota = this.shipQuotas[ship];
        }
        count += 1;
        if (xcount > 1) {
          quota = morexQuota;
        }
      }
      if (count === ship) {
        for (let i = 0; i < ship; i++) {
          if ((enemyTable[x][y + i]).status === 'hit') {
            this.probabilityMap[x][y + i] = 0;
          }
          else if (8 * x + (y + i) % 2 === 0) {
            this.probabilityMap[x][y + i] += quota - 2;
          } else {
            this.probabilityMap[x][y + i] += quota;
          }
        }
      }
    }
    if (x + ship - 1 < 8 && y < 8) {
      let count = 0;
      let quota = mainQuota;
      let xcount = 0;
      for (let i = 0; i < ship; i++) {
        if ((enemyTable[x + i][y]).status === 'miss') {
          this.probabilityMap[x + i][y] = 0;
          break;
        }
        if ((enemyTable[x + i][y]).status === 'hit') {
          xcount += 1;
          quota = myQuotas[ship];
        }
        count += 1;
        if (xcount > 1) {
          quota = morexQuota;
        }
      }
      if (count === ship) {
        for (let i = 0; i < ship; i++) {
          if ((enemyTable[x + i][y]).status === 'hit') {
            this.probabilityMap[x + i][y] = 0;
          }
          else if (8 * (x + i) + y % 2 === 0) {
            this.probabilityMap[x + i][y] += quota - 2;
          } else {
            this.probabilityMap[x + i][y] += quota;
          }
        }
      }
    }
  }

  /// Calculates probabilities
  private calculateProbability(): void {
    for (let i = 0; i < 8; i++) {
      this.probabilityMap[i] = [];
      for (let j = 0; j < 8; j++) {
        this.probabilityMap[i][j] = 0;
      }
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        for (const ship of [2, 3, 4]) {
          this.fitShip(i, j, ship, this.quota, this.xquota, this.morexQuota);
          console.log(this.probabilityMap[7][0]);
        }
      }
    }
  }

  takeShot(): void {
    this.calculateProbability();
    let maxProbability = 0;
    let mostProbablePosition = [0, 0];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.enemyTable.displayForEnemy()[i][j].status === 'miss' || this.enemyTable.displayForEnemy()[i][j] === 'hit') {
          this.probabilityMap[i][j] = 0;
        }
        if (this.probabilityMap[i][j] > maxProbability) {
          maxProbability = this.probabilityMap[i][j];
          mostProbablePosition = [i, j];
        }
      }
    }
    this.enemyTable.hit(mostProbablePosition[0], mostProbablePosition[1]);
  }
}

export class EasyAI extends AIPlayer{
  constructor(myTable: TableComponent, enemyTable: TableComponent) {
    super(myTable, enemyTable);
  }
  takeShot(): void {
    while (true){
      const x = Math.floor(Math.random() * 8);
      const y = Math.floor(Math.random() * 8);
      if (this.enemyTable.displayForEnemy()[x][y].status === 'none'){
        this.enemyTable.hit(x, y);
        break;
      }
    }
  }
}

export class MediumAI extends AIPlayer{
  private readonly seekIndices: Array<{x: number, y: number}>;
  private nearStack: Stack<{x: number, y: number}>;
  constructor(myTable: TableComponent, enemyTable: TableComponent) {
    super(myTable, enemyTable);
    this.seekIndices = new Array<{x: number, y: number}>();
    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        if (i % 2 !== j % 2) {
          this.seekIndices.push({x: i, y: j});
        }
      }
    }
    this.nearStack = new Stack<{x: number, y: number}>();
  }
  takeShot(): void {
    if (this.nearStack.length === 0){
      this.seek();
    }
    else {
      this.destroy();
    }
  }
  seek(): void{
    while (true){
      const indices = this.seekIndices[Math.floor(Math.random() * this.seekIndices.length)];
      if (this.enemyTable.displayForEnemy()[indices.x][indices.y].status === 'none'){
        this.shoot(indices.x, indices.y);
        break;
      }
    }
  }
  shoot(x: number, y: number): void{
    const hit = this.enemyTable.hit(x, y);
    if (hit){
      if (x + 1 < 8){
        const aux = x + 1;
        this.nearStack.push({x: aux, y});
      }
      if (x - 1 >= 0) {
        const aux = x - 1;
        this.nearStack.push({x: aux, y});
      }
      if (y + 1 < 8) {
        const aux = y + 1;
        this.nearStack.push({x, y: aux});
      }
      if (y - 1 >= 0) {
        const aux = y - 1;
        this.nearStack.push({x, y: aux});
      }
    }
  }
  destroy(): void{
    while (this.nearStack.length > 0){
      const nextTarget = this.nearStack.pop();
      if (this.enemyTable.displayForEnemy()[nextTarget.x][nextTarget.y].status === 'none'){
        this.shoot(nextTarget.x, nextTarget.y);
        break;
      }
    }
  }
}
