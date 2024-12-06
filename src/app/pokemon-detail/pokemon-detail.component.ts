import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { routes } from '../app.routes';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [MatProgressSpinner, NgIf,],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css'],
})
export class PokemonDetailComponent implements OnInit {
  pokemon: any = null;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id'); // Obtener el ID de la URL
      if (id) {
        this.pokemonService.getPokemonDetails(id).subscribe({
          next: (data) => (this.pokemon = data),
          error: (error) =>
            console.error('Error cargando los detalles del Pokémon', error),
        });
      }
    });
  }
}
