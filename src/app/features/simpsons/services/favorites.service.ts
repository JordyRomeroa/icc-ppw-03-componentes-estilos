// ======================================================================
// IMPORTACIONES NECESARIAS
// ======================================================================
import { inject, Injectable, signal } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';


// Firebase Firestore (AngularFire v7+ modular)
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp
} from '@angular/fire/firestore';

// Tu servicio de autenticación
import { AuthService } from '../../../core/services/firebase/auth.service';

// Tu modelo Favorite
import { Favorite } from '../interface/favorite.interface';


@Injectable({
  providedIn: 'root'
})
// ,,,, importaciones
export class FavoritesService {
  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);

  favorites = signal<Favorite[]>([]);
  loading = signal(false);

  /**
   * Agregar un favorito a Firestore
   */
  addFavorite(nombre: string, image: string, customName?: string): Observable<any> {
    const user = this.authService.currentUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const favorite: Omit<Favorite, 'id'> = {
      nombre,
      customName: customName || nombre,
      image,
      userId: user.uid,
      createdAt: new Date()
    };

    const favoritesCollection = collection(this.firestore, 'favorites');
    return from(addDoc(favoritesCollection, {
      ...favorite,
      createdAt: Timestamp.fromDate(favorite.createdAt)
    }));
  }

  /**
   * Obtener todos los favoritos del usuario actual
   */
  getFavorites(): Observable<Favorite[]> {
    const user = this.authService.currentUser();

    if (!user) {
      return from([[]]);
    }

    this.loading.set(true);

    const favoritesCollection = collection(this.firestore, 'favorites');
    const q = query(favoritesCollection, where('userId', '==', user.uid));

    return from(getDocs(q)).pipe(
      map(snapshot => {
        const favorites = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt'].toDate()
        } as Favorite));

        this.favorites.set(favorites);
        this.loading.set(false);
        return favorites;
      })
    );
  }

  /**
   * Actualizar el nombre personalizado de un favorito
   */
  updateFavorite(id: string, customName: string): Observable<void> {
    const favoriteDoc = doc(this.firestore, 'favorites', id);
    return from(updateDoc(favoriteDoc, { customName }));
  }

  /**
   * Eliminar un favorito
   */
  deleteFavorite(id: string): Observable<void> {
    const favoriteDoc = doc(this.firestore, 'favorites', id);
    return from(deleteDoc(favoriteDoc));
  }

  /**
   * Verificar si un personaje ya es favorito
   */
  isFavorite(nombre: string): boolean {
    return this.favorites().some(fav => fav.nombre === nombre);
  }
}
