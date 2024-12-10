import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  getAllTypes() {
    throw new Error('Method not implemented.');
  }
  getPokemonList() {
    throw new Error('Method not implemented.');
  }
  private baseUrl: string = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  // Obtener la lista de Pokémon con paginación
  getAllPokemon(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon?limit=100000&offset=0`);
  }

  // Obtener detalles básicos de un Pokémon (nombre o ID)
  getPokemonDetails(nameOrId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${nameOrId}`).pipe(
      switchMap((pokemon) =>
        this.getPokemonSpecies(pokemon.species.url).pipe(
          map((species) => ({
            ...pokemon, // Información básica del Pokémon
            habitat: species.habitat?.name || 'Desconocido',
            generation: species.generation?.name || 'Desconocida',
            flavorText: species.flavor_text_entries.find(
              (entry: any) => entry.language.name === 'es'
            )?.flavor_text || 'Sin descripción disponible',
          }))
        )
      )
    );
  }

  // Obtener ubicaciones del Pokémon
  getPokemonLocations(nameOrId: string): Observable<string[]> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${nameOrId}/encounters`).pipe(
      map((locations) =>
        locations.map((location: any) => location.location_area.name)
      )
    );
  }

  // Obtener los tipos del Pokémon
  getPokemonTypes(pokemonUrl: string): Observable<string[]> {
    return this.http.get<any>(pokemonUrl).pipe(
      map((details: { types: any[] }) =>
        details.types.map((typeObj: any) => typeObj.type.name)
      )
    );
  }

  // Obtener detalles de la especie del Pokémon
  private getPokemonSpecies(speciesUrl: string): Observable<any> {
    return this.http.get<any>(speciesUrl);
  }
}
