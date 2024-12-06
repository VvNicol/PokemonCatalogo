import { Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';

export const routes: Routes = [
  { path: '', component: PokemonListComponent }, // Página inicial con lista de Pokémon
  { path: 'pokemon/:id', component: PokemonDetailComponent }, // Página de detalles
];
