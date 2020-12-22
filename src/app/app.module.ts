import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/login/login.component';
import { SearchPageComponent } from './features/search-page/search-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationHeaderComponent } from './features/navigation-header/navigation-header.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import {MatTableModule} from '@angular/material/table';
import { DataTableSearchComponent } from './features/data-table-search/data-table-search.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AdvanceSearchComponent } from './features/advance-search/advance-search.component';
import { TransmittalComponent } from './features/transmittal/transmittal.component';
import { ContentHeaderComponent } from './features/content-header/content-header.component';
import { DataTableTransmittalComponent } from './features/data-table-transmittal/data-table-transmittal.component';
import { Create } from './features/transmittal/create/create.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchPageComponent,
    NavigationHeaderComponent,
    DataTableSearchComponent,
    DataTableTransmittalComponent,
    AdvanceSearchComponent,
    TransmittalComponent,
    ContentHeaderComponent,
    Create
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,ReactiveFormsModule,FormsModule,
    HttpClientModule, 
    BrowserAnimationsModule,MatSliderModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,MatNativeDateModule,MatRippleModule,MatProgressSpinnerModule
    
  ],
  providers: [    
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
