import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const exports = [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...exports],
  exports
})
export class MaterialModule {}
