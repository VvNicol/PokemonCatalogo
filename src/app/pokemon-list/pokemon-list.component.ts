import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { CategoryFilterComponent } from "./type-filter/category-filter.component";

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, CommonModule, MatCardModule, MatProgressSpinner, MatButton, CategoryFilterComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  pokemons: any[] = [];
  filteredPokemons: any[] = [];
  availableTypes: string[] = [];
  selectedType: string = '';
  selectedLetter: string = '';
  searchQuery: string = '';
  loading: boolean = true;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadPokemonList();
  }

  private loadPokemonList(): void {
    this.pokemonService.getPokemonList().subscribe({
      next: (data) => {
        const pokemonRequests = data.results.map((pokemon: any) =>
          this.pokemonService.getPokemonDetails(pokemon.name).toPromise()
        );

        Promise.all(pokemonRequests)
          .then((details) => {
            this.pokemons = details.map((pokemon: any) => ({
              ...pokemon,
              typesText: pokemon.types
                .map((type: { type: { name: string } }) => type.type.name)
                .join(', '),
            }));

            const typesSet = new Set<string>();
            this.pokemons.forEach((pokemon) =>
              pokemon.types.forEach((type: { type: { name: string } }) =>
                typesSet.add(type.type.name)
              )
            );
            this.availableTypes = Array.from(typesSet);

            this.filteredPokemons = [...this.pokemons];
            this.loading = false;
          })
          .catch((error) => {
            console.error('Error cargando los detalles de los Pokémon', error);
            this.loading = false;
          });
      },
      error: (error) => {
        console.error('Error obteniendo la lista de Pokémon', error);
        this.loading = false;
      },
    });
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
    this.filterPokemons();
  }


  onLetterSelected(letter: string): void {
    this.selectedLetter = letter;
    this.filterPokemons();
  }

  onSearchQueryChanged(query: string): void {
    this.searchQuery = query.toLowerCase();
    this.filterPokemons();
  }

  private filterPokemons(): void {
    this.filteredPokemons = this.pokemons.filter((pokemon) => {
      const matchesType =
        !this.selectedType ||
        pokemon.types.some(
          (type: { type: { name: string } }) =>
            type.type.name.toLowerCase() === this.selectedType.toLowerCase()
        );

      const matchesLetter =
        !this.selectedLetter ||
        pokemon.name[0].toUpperCase() === this.selectedLetter;

      const matchesSearch =
        !this.searchQuery || pokemon.name.toLowerCase().includes(this.searchQuery);

      return matchesType && matchesLetter && matchesSearch;
    });
  }
}

