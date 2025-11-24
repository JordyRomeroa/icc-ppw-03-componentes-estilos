
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

  /// VERISION REACTIVA
  instResource = rxResource({
  // 1. La petición depende de los valores de las señales
  request: () => ({
    page: this.paginationService.currentPage() - 1,
    limit: this.bannersPerPage(),
  }),

  // 2. El loader ejecuta el servicio de la API según esos valores
  loader: ({ request }) => {
    return this.instService.getInstitucionesUsers({
      offset: request.page * request.limit,
      limit: request.limit,
    });
  },
});
}
