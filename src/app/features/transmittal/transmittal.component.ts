import { TransmittalResponse } from './../../models/transmittalResponse';
import { Source } from './../../models/api.notification.model';
import { FWCService } from 'src/app/services/fwc.service';
import { TransmittalSteps } from './transmittal-steps.enum';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { formatDate } from '../../helper/helper-methods';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'transmittal',
  templateUrl: './transmittal.component.html',
  styleUrls: ['./transmittal.component.scss']
})
export class TransmittalComponent implements OnInit {
 date = new Date();
 selectedDate : string;
 steps =  TransmittalSteps;
 currentStep :string=TransmittalSteps.New;
  constructor(private service : FWCService, private detector: ChangeDetectorRef) { }  
  ngOnInit(): void {    
      this.selectedDate=formatDate(this.date);
  }

  setDate(event: any) {
    this.selectedDate=formatDate(event.value);    
  }

  hideSendVerification:boolean;
  onHideVerification(hide:boolean){
    this.hideSendVerification=hide;
  }

  get hasDeptDocRecord(){
    return this.service.retrieve(Source.TransmittalList).data.length!==0;
  }

  proceed(step : TransmittalSteps,options? : {edit:boolean,transmittal:TransmittalResponse}){        
    this.currentStep=step;    
    switch (step) {
      case TransmittalSteps.Submit:       
        if(!options)   {
          this.service.retrieve(Source.TransmittalList).data=[];
          this.service.backend.createTransmittal(this.selectedDate,"Data Entry").subscribe();
        }else{
          this.service.retrieve(Source.TransmittalCreation).data=[options.transmittal];
          this.service.backend.getDeptDocRecord(options.transmittal.transmittalNumber).subscribe();          
        }
            
        break; 
      case TransmittalSteps.Final:   
        var transmittal = this.service.retrieve(Source.TransmittalCreation).data[0];               
        var transmittalList =  this.service.retrieve(Source.TransmittalList).data;          
        var totalCheckAmount = transmittalList.map(m=>parseInt(m.checkAmount)).reduce((a, b) => a + b, 0);         
        var payload ={
          "transmittalTotalCount":transmittalList.length,
          "transmittalTotal": totalCheckAmount,
          "transmittalStatus": "Data Entry Verification"
        }        
        this.service.backend.updateTransmittal(transmittal.transmittalNumber,payload).pipe(tap(()=>this.service.send.next(true))).subscribe();
        break;       
      default:        
        break;
    }
    this.detector.detectChanges();
  } 




}

