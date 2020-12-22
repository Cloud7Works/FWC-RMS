import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators'; 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'florida-fwcc';
  hideSideMenu$ : Observable<boolean>;
  constructor(public route : Router){
   this.hideSideMenu$ = route.events.pipe(filter(event=>event instanceof NavigationEnd),
    map((data:any)=>{
      return  data.url!=='/login' && data.url!=='/';
    }));
  }
}
