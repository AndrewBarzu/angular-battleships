import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EndScreenComponent} from './end-screen/end-screen.component';
import {GameComponent} from './game/game.component';

const routes: Routes = [
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { path: 'game', component: GameComponent, data: { animationState: 'game' } },
  { path: 'endScreen/:status', component: EndScreenComponent, data: { animationState: 'end' } },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
