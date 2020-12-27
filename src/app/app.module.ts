import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

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
import { AppTooltipComponent } from './features/app-tooltip/app-tooltip.component';
import { AppTooltipModule } from './features/app-tooltip/app-tooltip.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { AppConfiguration } from './services/app.configuration';
import { ConfigurationService } from './services/configuration.service';
import { NotificationService } from './services/notification.service';
import { FWCDataBackend } from './models/fwc.api.backend.model';


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
    Create,
    NotFoundComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,ReactiveFormsModule,FormsModule,
    HttpClientModule, 
    BrowserAnimationsModule,MatSliderModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MatProgressSpinnerModule,    
    CommonModule, NgbModule
    
  ],
  providers: [    
    NotificationService,
    FWCDataBackend,
    ConfigurationService,
    AppConfiguration,
    {
      provide:APP_INITIALIZER,
      useFactory:(config:AppConfiguration)=>()=>config.initialiaze(),
      deps:[AppConfiguration],
      multi:true
    }
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
