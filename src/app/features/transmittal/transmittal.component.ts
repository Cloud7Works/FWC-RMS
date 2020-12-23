import { Source } from './../../models/api.notification.model';
import { FWCService } from 'src/app/services/fwc.service';
import { TransmittalSteps } from './transmittal-steps.enum';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { formatDate } from '../../helper/helper-methods';
import { Router } from '@angular/router';


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
  constructor(private service : FWCService, private router : Router,private detector: ChangeDetectorRef) { }  
  ngOnInit(): void {    
        this.selectedDate=formatDate(this.date);
  }

  setDate(type: string, event: any) {
    this.selectedDate=formatDate(event.value);    
  }
  hideSendVerification:boolean;
  onHideVerification(hide:boolean){
    this.hideSendVerification=hide;
    console.log('hide');
    console.log(hide);
  }
  proceed(step : TransmittalSteps){        
    this.currentStep=step;    
    switch (step) {
      case TransmittalSteps.Submit:          
          this.service.retrieve(Source.TransmittalList).data=[];
          this.service.backend.createTransmittal(this.selectedDate,"Data Entry").subscribe();
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
        this.service.backend.updateTransmittal(transmittal.transmittalNumber,payload).subscribe();
        break;       
      default:        
        break;
    }
    this.detector.detectChanges();
  } 


}

