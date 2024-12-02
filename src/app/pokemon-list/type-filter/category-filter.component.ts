import { CommonModule, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [NgFor, CommonModule, FormsModule],
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.css']
})

export class CategoryFilterComponent {
  @Input() availableTypes: string[] = [];
  @Output() typeSelected = new EventEmitter<string>();

  selectedType: string = ''; // Definición de la propiedad selectedType

  onTypeChange(): void {
    console.log('Tipo seleccionado:', this.selectedType);
    this.typeSelected.emit(this.selectedType); // Emitimos el tipo seleccionado
  }
}