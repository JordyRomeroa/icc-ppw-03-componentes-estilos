
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { SimpsonsService } from '../service/simpsons-service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { PaginationService } from '../service/PaginationService';


export class SimpsonsPageComponent {
  private simpsonsService = inject(SimpsonsService);
  paginationService = inject(PaginationService);

  simpsonsResource = toSignal(
    this.simpsonsService.getCharacters(this.paginationService.currentPage()).pipe(
      map(res => res)
    ),
    { initialValue: null }
  );


};

