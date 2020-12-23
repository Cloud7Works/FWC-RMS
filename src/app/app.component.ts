import { FWCService } from '../app/services/fwc.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators'; 
import { Progress } from './models/api.notification.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'florida-fwcc';
  hideSideMenu$ : Observable<boolean>;
  constructor(public route : Router, private service : FWCService,private detector : ChangeDetectorRef){
   this.hideSideMenu$ = route.events.pipe(filter(event=>event instanceof NavigationEnd),
    map((data:any)=>{
      return  data.url!=='/login' && data.url!=='/';
    }));
    
  }
  ngAfterViewChecked(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.updateProgress();
  }
  isLoading:boolean=false;
  updateProgress(){
    this.service.notifier.subscribe(g=>{
      this.isLoading = g.status.progress==Progress.InProgress
      this.detector.detectChanges();
    });
  }
}
