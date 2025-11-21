import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SignalBox } from "../signal-box/signal-box";
import { ProgressBar } from "../progress-bar/progress-bar";

@Component({
  selector: 'app-estilos-page',
  standalone: true,
  templateUrl: './estilos-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SignalBox, ProgressBar],
})
export class EstilosPage {}
