// pokemon-list.component.ts
import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { CategoryFilterComponent } from './type-filter/category-filter.component'; // Asegúrate de importar este componente
import { firstValueFrom } from 'rxjs';

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
  availableTypes: string[] = []; // Lista de tipos completos
  selectedType: string = '';
  selectedLetter: string = '';
  searchQuery: string = '';
  loading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 20; // Número de Pokémon por página
  paginatedPokemons: any[] = [];
  totalPages: number = 0;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadPokemonList();  // Cargar todos los tipos de Pokémon
  }

  private loadPokemonList(page: number = 1, limit: number = 20): void {
    this.loading = true;

    this.pokemonService.getAllPokemon().subscribe({
      next: async (data) => {
        try {
          // Obtención de detalles de los Pokémon
          const pokemonRequests = data.results.map((pokemon: any) =>
            firstValueFrom(this.pokemonService.getPokemonDetails(pokemon.name))
          );

          const details = await Promise.all(pokemonRequests);

          // Mapeo de detalles de Pokémon con tipos y otras propiedades
          this.pokemons = details.map((pokemon: any) => ({
            ...pokemon,
            typesText: pokemon.types
              .map((type: { type: { name: string } }) => type.type.name)
              .join(', '),
          }));

          // Obtener todos los tipos únicos de Pokémon
          this.availableTypes = Array.from(
            new Set(
              details.flatMap((pokemon: any) =>
                pokemon.types.map((type: { type: { name: string } }) => type.type.name)
              )
            )
          );

          // Filtrar todos los Pokémon
          this.filteredPokemons = [...this.pokemons];

          this.totalPages = Math.ceil(this.filteredPokemons.length / this.itemsPerPage);

          // Paginación sobre los resultados filtrados
          this.paginatePokemons(page, limit);


          this.loading = false;
        } catch (error) {
          console.error('Error cargando los detalles de los Pokémon', error);
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error obteniendo la lista de Pokémon', error);
        this.loading = false;
      },
    });
  }


  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPokemonList(page, this.itemsPerPage);
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
    this.filterPokemons();
    this.paginatePokemons(this.currentPage, this.itemsPerPage);
  }

  onLetterSelected(letter: string): void {
    this.selectedLetter = letter;
    this.filterPokemons();
    this.paginatePokemons(this.currentPage, this.itemsPerPage);
  }

  onSearchQueryChanged(query: string): void {
    this.searchQuery = query.toLowerCase();
    this.filterPokemons();
    this.paginatePokemons(this.currentPage, this.itemsPerPage);
  }

  private filterPokemons(): void {
    this.filteredPokemons = this.pokemons.filter((pokemon) => {
      const matchesSearch = !this.searchQuery || pokemon.name.toLowerCase().includes(this.searchQuery);
      const matchesLetter = !this.selectedLetter || pokemon.name[0].toUpperCase() === this.selectedLetter;
      const matchesType = !this.selectedType || pokemon.types.some((type: any) => type.type.name === this.selectedType);
      return matchesSearch && matchesLetter && matchesType;
    });
  }


  private paginatePokemons(page: number, limit: number): void {
    const startIndex = (page - 1) * limit;
    this.paginatedPokemons = this.filteredPokemons.slice(startIndex, startIndex + limit);
  }
}
