import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signal-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signal-box.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalBox {
  valor = signal<number>(0);

  cambiarValor(event: Event) {
    const input = event.target as HTMLInputElement;
    const nuevoValor = Number(input.value);
    this.valor.set(nuevoValor);
  }
}
