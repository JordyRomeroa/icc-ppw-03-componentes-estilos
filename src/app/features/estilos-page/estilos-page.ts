import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SignalBox } from '../signal-box/signal-box';
import { CommonModule } from '@angular/common';
import { ProgressBar } from '../progress-bar/progress-bar';

@Component({
  selector: 'app-estilos-page',
  standalone: true,
  templateUrl: './estilos-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SignalBox,CommonModule,ProgressBar],
})
export class EstilosPage {}
