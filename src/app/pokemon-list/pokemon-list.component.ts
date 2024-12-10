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
  pokemons: any[] = []; // Lista para almacenar todos los Pokémon cargados
  filteredPokemons: any[] = []; // Lista de Pokémon filtrados según los criterios seleccionados
  availableTypes: string[] = []; // Lista de tipos disponibles para filtrar
  selectedType: string = ''; // Tipo de Pokémon seleccionado para el filtro
  selectedLetter: string = ''; // Letra seleccionada para filtrar Pokémon por inicial
  searchQuery: string = ''; // Consulta de búsqueda manual
  loading: boolean = true; // Indicador de carga para mostrar spinner mientras se obtienen los datos
  currentPage: number = 1; // Página actual de resultados
  itemsPerPage: number = 20; // Número de Pokémon a mostrar por página
  paginatedPokemons: any[] = []; // Lista de Pokémon mostrados en la página actual
  totalPages: number = 0; // Total de páginas disponibles para paginación

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadPokemonList();  // Llamada inicial para cargar la lista de Pokémon
  }

  private loadPokemonList(page: number = 1, limit: number = 20): void {
    this.loading = true; // Activar el indicador de carga

    // Obtener la lista de Pokémon desde el servicio
    this.pokemonService.getAllPokemon().subscribe({
      next: async (data) => {
        try {
          // Obtener detalles de cada Pokémon individualmente
          const pokemonRequests = data.results.map((pokemon: any) =>
            firstValueFrom(this.pokemonService.getPokemonDetails(pokemon.name))
          );

          // Esperar a que se obtengan todos los detalles de los Pokémon
          const details = await Promise.all(pokemonRequests);

          // Mapear los detalles obtenidos a un formato adecuado
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

          // Copiar los Pokémon para ser filtrados
          this.filteredPokemons = [...this.pokemons];

          // Calcular el total de páginas para la paginación
          this.totalPages = Math.ceil(this.filteredPokemons.length / this.itemsPerPage);

          // Paginación sobre los resultados filtrados
          this.paginatePokemons(page, limit);

          this.loading = false; // Desactivar el indicador de carga cuando los datos estén listos
        } catch (error) {
          console.error('Error cargando los detalles de los Pokémon', error);
          this.loading = false; // Desactivar el indicador de carga en caso de error
        }
      },
      error: (error) => {
        console.error('Error obteniendo la lista de Pokémon', error);
        this.loading = false; // Desactivar el indicador de carga en caso de error
      },
    });
  }

  // Función para manejar el cambio de página en la paginación
  onPageChange(page: number): void {
    this.currentPage = page; // Actualizar la página actual
    this.loadPokemonList(page, this.itemsPerPage); // Volver a cargar la lista con los Pokémon de la nueva página
  }

  // Filtro para los tipos de Pokémon
  onTypeChange(type: string): void {
    this.selectedType = type; // Actualizar el tipo seleccionado
    this.filterPokemons(); // Aplicar el filtro
    this.paginatePokemons(this.currentPage, this.itemsPerPage); // Actualizar la paginación con los Pokémon filtrados
  }

  // Filtro para filtrar por la primera letra del nombre del Pokémon
  onLetterSelected(letter: string): void {
    this.selectedLetter = letter; // Actualizar la letra seleccionada
    this.filterPokemons(); // Aplicar el filtro
    this.paginatePokemons(this.currentPage, this.itemsPerPage); // Actualizar la paginación con los Pokémon filtrados
  }

  // Filtro para búsqueda manual por nombre del Pokémon
  onSearchQueryChanged(query: string): void {
    this.searchQuery = query.toLowerCase(); // Convertir la búsqueda a minúsculas
    this.filterPokemons(); // Aplicar el filtro
    this.paginatePokemons(this.currentPage, this.itemsPerPage); // Actualizar la paginación con los Pokémon filtrados
  }

  // Función para filtrar los Pokémon basados en los criterios de búsqueda
  private filterPokemons(): void {
    this.filteredPokemons = this.pokemons.filter((pokemon) => {
      // Comprobaciones para cada tipo de filtro: búsqueda por nombre, letra y tipo
      const matchesSearch = !this.searchQuery || pokemon.name.toLowerCase().includes(this.searchQuery);
      const matchesLetter = !this.selectedLetter || pokemon.name[0].toUpperCase() === this.selectedLetter;
      const matchesType = !this.selectedType || pokemon.types.some((type: any) => type.type.name === this.selectedType);
      return matchesSearch && matchesLetter && matchesType;
    });
  }

  // Función para paginar los Pokémon filtrados
  private paginatePokemons(page: number, limit: number): void {
    const startIndex = (page - 1) * limit; // Índice de inicio de la página actual
    this.paginatedPokemons = this.filteredPokemons.slice(startIndex, startIndex + limit); // Mostrar solo los Pokémon correspondientes a la página actual
  }
}
