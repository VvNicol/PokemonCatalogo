import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private baseUrl: string = 'https://pokeapi.co/api/v2'
  constructor(private http: HttpClient) { }

  //Por defecto mostrar 20 pokemons 
  getPokemonList(limit: number = 1000, offset: number = 0): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemonDetails(nameOrId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${nameOrId}`);
  }
  getPokemonTypes(pokemonUrl: string): Observable<string[]> {
    return this.http.get<any>(pokemonUrl).pipe(
      map((details: { types: any[]; }) => {
        // Extraemos los nombres de los tipos
        return details.types.map((typeObj: any) => typeObj.type.name);
      })
    );
  }
}
