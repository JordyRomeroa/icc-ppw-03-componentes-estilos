import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [],
  templateUrl: './progress-bar.html',
  styleUrls: ['./progress-bar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBar {

  // valor numérico del progreso
  private _progreso = signal(0);

  // getter para usar progreso() en el template
  progreso = () => this._progreso();

  // método usado por el template para la condición [class]='valor() > 50 ? ...'
  valor() {
    return this._progreso();
  }

  actualizarProgreso(event: Event) {
    const input = event.target as HTMLInputElement;
    const nuevoValor = Number(input.value);
    this._progreso.set(nuevoValor);
  }

}
