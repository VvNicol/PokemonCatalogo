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
  @Input() availableTypes: string[] = [];
  @Output() typeSelected = new EventEmitter<string>();
  @Output() letterSelected = new EventEmitter<string>(); // Nuevo Output para las letras
  @Output() searchQueryChanged = new EventEmitter<string>();

  selectedType: string = ''; // Tipo seleccionado
  selectedLetter: string = ''; // Letra seleccionada

  onTypeChange(): void {
    console.log('Tipo seleccionado:', this.selectedType);
    this.typeSelected.emit(this.selectedType); // Emitimos el tipo seleccionado
  }

  onLetterChange(letter: string): void {
    console.log('Letra seleccionada:', letter);
    this.selectedLetter = letter;
    this.letterSelected.emit(this.selectedLetter); // Emitimos la letra seleccionada
  }

  onSearchQueryChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    const query = inputElement?.value || ''; // Asegúrate de manejar si inputElement es null
    console.log('Búsqueda actual:', query);
    this.searchQueryChanged.emit(query);
  }
}