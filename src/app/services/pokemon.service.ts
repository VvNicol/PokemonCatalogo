import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private baseUrl: string = 'https://pokeapi.co/api/v2'
  constructor(private http: HttpClient) { }

  //Por defecto mostrar 20 pokemons 
  getPokemonList(limit: number = 20, offset: number = 0): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemonDetails(nameOrId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${nameOrId}`);
  }

}
