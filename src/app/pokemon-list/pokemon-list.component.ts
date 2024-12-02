import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, CommonModule, MatCardModule, MatProgressSpinner],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css'
})
export class PokemonListComponent implements OnInit {
  pokemons: any[] = [];
  loading = true;

  constructor(private PokemonService: PokemonService) { }

  ngOnInit() {
    this.PokemonService.getPokemonList().subscribe({
      next: (data) => {
        this.pokemons = data.results.map((pokemon: any) => ({
          ...pokemon,
          types: [], // Inicializamos el array de tipos
        }));

        this.pokemons.forEach((pokemon) => {
          this.PokemonService.getPokemonTypes(pokemon.url).subscribe({
            next: (types) => {
              pokemon.types = types;
            },
            error: (error) => {
              console.error(`Error al obtener tipos de ${pokemon.name}`, error);
            },
          });
        });

        this.loading = false;
      },
      error: (error) => {
        console.error('Error en obtener la lista de pokémon', error);
        this.loading = false;
      },
    });
  }
}

