import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [MatProgressSpinner, NgIf ],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})

export class PokemonDetailComponent implements OnInit {
  pokemon: any = null;
  formattedTypes: string = '';
  abilities: string = '';
  locations: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadPokemonDetails(id);
      }
    });
  }

  loadPokemonDetails(id: string): void {
    // Detalles del Pokémon
    this.pokemonService.getPokemonDetails(id).subscribe({
      next: (details) => {
        this.pokemon = details;
        this.formattedTypes = details.types.map((type: any) => type.type.name).join(', ');
        this.abilities = details.abilities.map((ability: any) => ability.ability.name).join(', ');
      },
      error: (error) => {
        console.error('Error al cargar detalles del Pokémon:', error);
        this.pokemon = null;  // En caso de error, asegurarse de que pokemon sea null
      }
    });
  
    // Ubicaciones del Pokémon
    this.pokemonService.getPokemonLocations(id).subscribe({
      next: (locations) => {
        this.locations = locations.length ? locations : ['No disponible'];
      },
      error: (error) => {
        console.error('Error al cargar ubicaciones del Pokémon:', error);
        this.locations = ['No disponible'];  // En caso de error, mostrar "No disponible"
      }
    });
  }  
}
