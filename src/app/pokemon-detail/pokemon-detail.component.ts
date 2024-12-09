import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [MatProgressSpinner, NgIf,],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css'],
})
export class PokemonDetailComponent implements OnInit {
  pokemon: any = null; // Inicializa como null para borrar la información anterior
  pokemonId: string | null = null;

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.pokemonId = params.get('id');
      if (this.pokemonId) {
        this.loadPokemonDetails(this.pokemonId);
      }
    });
  }

  loadPokemonDetails(id: string): void {
    this.pokemon = null; // Borra la información anterior
    this.pokemonService.getPokemonDetails(id).subscribe({
      next: (details) => {
        this.pokemon = details; // Asigna los nuevos detalles
      },
      error: (error) => {
        console.error('Error al cargar los detalles del Pokémon:', error);
      }
    });
  }
}