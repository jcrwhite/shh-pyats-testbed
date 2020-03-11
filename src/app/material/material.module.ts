import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';

const exports = [
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatExpansionModule
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...exports],
  exports
})
export class MaterialModule {}
