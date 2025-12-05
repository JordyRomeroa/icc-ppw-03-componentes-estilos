import { Component, effect, inject, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

// RxJS
import { switchMap, map, tap, catchError, of } from 'rxjs';

// Angular 20 signals interop
import { toSignal, rxResource } from '@angular/core/rxjs-interop';

// Formularios
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Componentes compartidos
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { HeroSimpsons } from '../components/hero-simpsons/hero-simpsons';
import { Breadcrumbs } from '../../../shared/components/breadcrumbs/breadcrumbs';

// Servicios
import { SimpsonsService } from '../service/simpsons-service';
import { PaginationService } from '../service/PaginationService';
// Update the path below to the correct location of FavoritesService
import { FavoritesService } from '../services/favorites.service';
// Update the path below to the correct location of auth.service if it exists elsewhere
import { AuthService as AuthFB } from '../../../core/services/firebase/auth.service';

// Interfaces
import { Favorite } from '../../simpsons/interface/favorite.interface';

@Component({
  selector: 'app-simpsons-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PaginationComponent,
    HeroSimpsons,
    Breadcrumbs,
    ReactiveFormsModule
  ],
  templateUrl: './simpsons-page.html',
})
export class SimpsonsPageComponent {

  private simpsonsService = inject(SimpsonsService);
  paginationService = inject(PaginationService);

  private favoritesService = inject(FavoritesService);
  private authService = inject(AuthFB);

  // Triggers para acciones de favoritos
  private addFavoriteAction = signal<{ nombre: string; imagen: string } | null>(null);
  private deleteFavoriteAction = signal<string | null>(null);
  private updateFavoriteAction = signal<{ id: string; customName: string } | null>(null);

  charactersPerPage = signal(10);

  // Signal que mantiene el número total de páginas
  totalPages = signal(0);

  constructor() {
    // Effect que actualiza el número de páginas cuando hay datos válidos
    effect(() => {
      if (this.simpsonsResource.hasValue()) {
        const data = this.simpsonsResource.value() as any;
        this.totalPages.set(data.pages);
      }
    });

    // Inicializar formulario de edición
    this.editForm = this.fb.group({
      customName: ['', [Validators.required, Validators.minLength(2)]]
    });

    // Effect: Recargar favoritos cuando el usuario se autentica
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.reloadFavoritesTrigger.update(v => v + 1);
      }
    });
  }

  simpsonsResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage(),
    }),
    stream: ({ params }) => {
      return this.simpsonsService.getCharacters(params.page);
    },
  });

  private fb = inject(FormBuilder);

  // Signal para trigger de recarga de favoritos
  private reloadFavoritesTrigger = signal(0);

  // rxResource para gestionar favoritos con Angular 20+
  favoritesResource = rxResource({
    params: () => ({ reload: this.reloadFavoritesTrigger() }),
    stream: ({ params }) => {
      const user = this.authService.currentUser();
      if (!user) return of([]);
      return this.favoritesService.getFavorites();
    }
  });

  /**
   * Recursos para operaciones de favoritos
   */
  private addFavoriteResource = rxResource({
    params: () => this.addFavoriteAction(),
    stream: ({ params }) => {
      if (!params) return of(null);
      return this.favoritesService.addFavorite(params.nombre, params.imagen).pipe(
        tap(() => {
          untracked(() => {
            this.reloadFavoritesTrigger.update(v => v + 1);
            alert('¡Agregado a favoritos!');
          });
        }),
        catchError((error) => {
          console.error('Error al agregar favorito:', error);
          alert('Error al agregar a favoritos: ' + error.message);
          return of(null);
        })
      );
    }
  });

  private deleteFavoriteResource = rxResource({
    params: () => this.deleteFavoriteAction(),
    stream: ({ params }) => {
      if (!params) return of(null);
      return this.favoritesService.deleteFavorite(params).pipe(
        tap(() => {
          untracked(() => {
            this.reloadFavoritesTrigger.update(v => v + 1);
            alert('Eliminado de favoritos');
          });
        }),
        catchError((error) => {
          console.error('Error al eliminar favorito:', error);
          return of(null);
        })
      );
    }
  });

  private updateFavoriteResource = rxResource({
    params: () => this.updateFavoriteAction(),
    stream: ({ params }) => {
      if (!params) return of(null);
      return this.favoritesService.updateFavorite(params.id, params.customName).pipe(
        tap(() => {
          untracked(() => {
            this.reloadFavoritesTrigger.update(v => v + 1);
            this.cancelEditingFavorite();
            alert('Nombre actualizado');
          });
        }),
        catchError((error) => {
          console.error('Error al actualizar favorito:', error);
          return of(null);
        })
      );
    }
  });

  // Signal para el ID del favorito en edición
  editingFavoriteId = signal<string | null>(null);

  // Formulario para editar nombres personalizados
  editForm!: FormGroup;

  // Computed signals para la UI
  favorites = () => this.favoritesResource.value() || [];
  loadingFavorites = this.favoritesResource.isLoading;


  /**
   * Disparar recarga de favoritos
   */
  reloadFavorites() {
    this.reloadFavoritesTrigger.update(v => v + 1);
  }

  /**
   * Agregar personaje a favoritos
   */
  addToFavorites(character: any) {
    const nombre = character.name || character.character;
    const imagen = character.image || '';

    if (!nombre) {
      console.error('Nombre del personaje no encontrado');
      alert('Error: No se pudo obtener el nombre del personaje');
      return;
    }

    this.addFavoriteAction.set({ nombre, imagen });
  }

  /**
   * Eliminar favorito
   */
  removeFromFavorites(favoriteId: string) {
    if (confirm('¿Eliminar de favoritos?')) {
      this.deleteFavoriteAction.set(favoriteId);
    }
  }

  /**
   * Iniciar edición de un favorito
   */
  startEditingFavorite(favorite: Favorite) {
    this.editingFavoriteId.set(favorite.id!);
    this.editForm.patchValue({
      customName: favorite.customName
    });
  }

  /**
   * Guardar cambios en el nombre personalizado
   */
  saveEditedFavorite() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const favoriteId = this.editingFavoriteId();
    const customName = this.editForm.value.customName;

    if (favoriteId && customName) {
      this.updateFavoriteAction.set({ id: favoriteId, customName });
    }
  }

  /**
   * Cancelar edición
   */
  cancelEditingFavorite() {
    this.editingFavoriteId.set(null);
    this.editForm.reset();
  }

  /**
   * Verificar si un personaje es favorito
   */
  isFavorite(characterName: string): boolean {
    return this.favorites().some(fav => fav.nombre === characterName);
  }
}
