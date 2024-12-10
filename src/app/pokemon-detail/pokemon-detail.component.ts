import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [MatProgressSpinner, NgIf],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})

export class PokemonDetailComponent implements OnInit {
  pokemon: any = null;  // Almacena los detalles del Pokémon
  formattedTypes: string = '';  // Almacena los tipos del Pokémon
  abilities: string = '';  // Almacena las habilidades del Pokémon
  locations: string[] = [];  // Almacena las ubicaciones donde se puede encontrar el Pokémon

  constructor(
    private route: ActivatedRoute,  // Inyecta ActivatedRoute para acceder a los parámetros de la ruta
    private pokemonService: PokemonService  // Inyecta el servicio para obtener los datos del Pokémon
  ) { }

  ngOnInit(): void {
    // Se suscribe a los parámetros de la ruta para obtener el ID del Pokémon
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');  // Obtiene el ID del Pokémon desde los parámetros de la URL
      if (id) {
        this.loadPokemonDetails(id);  // Si se encuentra un ID, carga los detalles del Pokémon
      }
    });
  }

  // Método que carga los detalles del Pokémon a través del servicio
  loadPokemonDetails(id: string): void {
    // Llama al servicio para obtener los detalles del Pokémon (nombre, tipo, habilidades)
    this.pokemonService.getPokemonDetails(id).subscribe({
      next: (details) => {
        // Asigna los detalles del Pokémon a las variables
        this.pokemon = details;
        this.formattedTypes = details.types.map((type: any) => type.type.name).join(', '); 
        this.abilities = details.abilities.map((ability: any) => ability.ability.name).join(', '); 
      },
      error: (error) => {
        // Si ocurre un error, muestra un mensaje y resetea los detalles del Pokémon
        console.error('Error al cargar detalles del Pokémon:', error);
        this.pokemon = null;  
      }
    });

    // Llama al servicio para obtener las ubicaciones del Pokémon
    this.pokemonService.getPokemonLocations(id).subscribe({
      next: (locations) => {
        // Si la respuesta es exitosa, asigna las ubicaciones
        this.locations = locations.length ? locations : ['No disponible']; 
      },
      error: (error) => {
        // Si ocurre un error, muestra un mensaje y asigna 'No disponible' a las ubicaciones
        console.error('Error al cargar ubicaciones del Pokémon:', error);
        this.locations = ['No disponible'];  // Resetea las ubicaciones a 'No disponible'
      }
    });
  }
}