import { CommonModule, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [
    NgFor,
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.css']
})
export class CategoryFilterComponent {
  // Propiedades de entrada que reciben datos del componente padre
  @Input() availableTypes: string[] = [];  // Tipos disponibles para seleccionar (proviene del componente padre)

  // Propiedades de salida que emiten eventos al componente padre
  @Output() typeSelected = new EventEmitter<string>();  // Emitir el tipo seleccionado
  @Output() letterSelected = new EventEmitter<string>();  // Emitir la letra seleccionada
  @Output() searchQueryChanged = new EventEmitter<string>();  // Emitir la búsqueda manual

  // Propiedades locales para almacenar la selección actual
  selectedType: string = '';  // Almacena el tipo seleccionado
  selectedLetter: string = '';  // Almacena la letra seleccionada

  // Método que se ejecuta cuando el tipo de Pokémon cambia
  onTypeChange(): void {
    console.log('Tipo seleccionado:', this.selectedType);
    this.typeSelected.emit(this.selectedType);  // Emite el tipo seleccionado al componente padre
  }

  // Método que se ejecuta cuando se selecciona una letra
  onLetterChange(letter: string): void {
    console.log('Letra seleccionada:', letter);
    this.selectedLetter = letter;  // Actualiza la letra seleccionada
    this.letterSelected.emit(this.selectedLetter);  // Emite la letra seleccionada al componente padre
  }

  // Método que se ejecuta cuando el usuario cambia la búsqueda manualmente
  onSearchQueryChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    const query = inputElement?.value || '';  // Obtiene el valor de la búsqueda (si no hay valor, es un string vacío)
    console.log('Búsqueda actual:', query);
    this.searchQueryChanged.emit(query);  // Emite la consulta de búsqueda al componente padre
  }
}
