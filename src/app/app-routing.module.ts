import { NotFoundComponent } from './features/not-found/not-found.component';
import { TransmittalComponent } from './features/transmittal/transmittal.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { SearchPageComponent } from './features/search-page/search-page.component';

const routes: Routes = [
  {
    path:'',
    component:LoginComponent
  },{
    path:'login',
    component:LoginComponent
  }, {
    path:'home',
    component:SearchPageComponent
  }, {
    path:'transmittal',
    component:TransmittalComponent
  },{
    path: '**',
    component:NotFoundComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
