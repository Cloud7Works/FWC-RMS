import { FWCService } from '../app/services/fwc.service';
import { Component, ChangeDetectorRef, TemplateRef, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators'; 
import { Progress } from './models/api.notification.model';
import { ToastService } from './services/toast.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @Input() error : any;
  title = 'florida-fwcc';
  hideSideMenu$ : Observable<boolean>;
  constructor(public route : Router, private service : FWCService,
    private detector : ChangeDetectorRef,public toastService: ToastService){
   this.hideSideMenu$ = route.events.pipe(filter(event=>event instanceof NavigationEnd),
    map((data:any)=>{
      return  data.url!=='/login' && data.url!=='/';
    }));    
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.service.send.pipe(tap(()=>this.customToast('Transmittal send to verification'))).subscribe();
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.updateProgress();
  }
  isLoading:boolean=false;
  updateProgress(){
    this.service.notification.notify.subscribe(g=>{
      this.isLoading = g.status.progress==Progress.InProgress      
      if(g.status.isCompleted && g.status.message.type=='CRUD'){
        var msg = g.status.isError ? g.status.message.operation : g.status.message.operation;
        this.customToast(msg ,g.status.isError);        
      }
      this.detector.detectChanges();
    });
  }

  
  standardToast() {
    this.toastService.show('I am a standard toast');
  }

  customToast(message:string,error? : boolean) {
    if(!error){
      this.toastService.show(message, { classname: 'bg-success text-light', delay: 5000 });      
    }else{
      this.toastService.show(message, { classname: 'bg-danger text-light', delay: 5000 });
    }
    
  }

  show = true;
  close() {
    this.show = false;
    setTimeout(() => this.show = true, 3000);
  }

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }
}
