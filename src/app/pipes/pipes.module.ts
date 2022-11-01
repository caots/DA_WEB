import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssesmentFilterPipe } from './assesment-filter.pipe';
import { FilterPipe } from './filter.pipe';

@NgModule({
  declarations: [
    AssesmentFilterPipe,
    FilterPipe
  ],
  imports: [
    CommonModule
  ], 
  exports: [
    AssesmentFilterPipe,
    FilterPipe
  ]  
})
export class PipesModule { }
