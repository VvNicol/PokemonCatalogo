import { Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';

export const routes: Routes = [
  { path: '', component: PokemonListComponent }, // Ruta para el listado
  { path: 'pokemon/:id', component: PokemonDetailComponent }, // Ruta para los detalles
];
