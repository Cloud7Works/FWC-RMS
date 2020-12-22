
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss']
})
export class NavigationHeaderComponent {

  constructor(private router : Router) {
    
   }
  menu = [{option:"Home",isActive:true, path:'home'},
          {option:"Data Entry",isActive:false, path:'transmittal'},
          {option:"Code Assignment",isActive:false, path:''},
          {option:"Revenue Management",isActive:false, path:''},
          {option:"Reports",isActive:false, path:''},
          {option:"Code Maintenance",isActive:false, path:''}];


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.menu.forEach(f=>f.isActive = f.path==location.pathname.replace('/',''));
  }
  
  udapteSelection(selected : string){
    this.menu.forEach(f=>f.isActive = f.option==selected);
    this.router.navigate(['/' + this.menu.find(f=>f.isActive).path]);
  }

}
