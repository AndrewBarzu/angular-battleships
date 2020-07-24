import { trigger, transition, style, query, animate, keyframes } from '@angular/animations';

export const routeTransitionAnimations = trigger('triggerName', [
  transition('* => game, * => end', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%'
      })
    ])
  ])
]);

export const fader = trigger('triggerName', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        opacity: 0,
        width: '100%',
        transform: 'scale(0) translateY(100%)'
      })
    ]),
    query(':enter', [
      animate('600ms ease',
        style({
          opacity: 1,
          transform: 'scale(1) translateY(0)'
        }))
    ])
  ])
]);
