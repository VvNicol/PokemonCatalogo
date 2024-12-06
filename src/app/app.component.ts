import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonListComponent } from "./pokemon-list/pokemon-list.component";
import { PokemonDetailComponent } from "./pokemon-detail/pokemon-detail.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PokemonListComponent, PokemonDetailComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PokemonCatalogo';
}