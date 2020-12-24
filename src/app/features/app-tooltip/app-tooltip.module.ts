import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTooltipComponent } from './app-tooltip.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [AppTooltipComponent],
  imports: [
    CommonModule,BrowserModule, FormsModule, NgbModule
  ],
  exports:[AppTooltipComponent],
  bootstrap:[AppTooltipComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppTooltipModule { }
