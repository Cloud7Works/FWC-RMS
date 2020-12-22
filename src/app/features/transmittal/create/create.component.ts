import { TransmittalResponse } from './../../../models/transmittalResponse';
import { CreateTransmittalDetailRequest } from './../../../models/createTransmittalDetailRequest';
import { tap, filter } from 'rxjs/operators';
import { TransmittalDetailResponse } from './../../../models/transmittalDetail';
import { Source } from '../../../models/api.notification.model';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { FWCService } from '../../../services/fwc.service';
import { TransmittalSteps } from '../transmittal-steps.enum';


@Component({
  selector: 'create-transmittal',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class Create implements OnInit {

  depDocNumberForm = new FormGroup({
    firstName: new FormControl(null,Validators.required),
    lastName: new FormControl(null,Validators.required),
    companyName: new FormControl(null,Validators.required),
    checkNumber: new FormControl(null,Validators.required),
    checkAmount: new FormControl(null,Validators.required),
    cashListing: new FormControl(null),
    comments: new FormControl(null) 
 });
  constructor(private service : FWCService,private detector: ChangeDetectorRef) { }
  steps=TransmittalSteps;
  @Input('transmittalStep') transmittalStep : TransmittalSteps = TransmittalSteps.Submit;
  get transmittalList() : TransmittalDetailResponse[]{
    return this.service.retrieve(Source.TransmittalList).data; 
  }

  get transmittal() : TransmittalResponse {
    return this.service.retrieve(Source.TransmittalCreation).data[0];
  }

  getFormControl(name:string){
    return this.depDocNumberForm.get(name);
  }
  
  hasValue = (val:string)=>{
    return val && val!=="";
  }
  ngOnInit(): void { 
    // if(this.hasValue(this.getFormControl('firstName').value) && 
    //    this.hasValue(this.getFormControl('lastName').value)){
    //     this.getFormControl('companyName').disable();
    // }else if(this.hasValue(this.getFormControl('companyName').value)){

    // }
    
  }

  requestDeptDocNumber(){ 
    var payload : CreateTransmittalDetailRequest = this.depDocNumberForm.value;    
    this.service.backend.createDepartmentDocumentNumber(this.transmittal.transmittalNumber,payload).subscribe();   
    this.depDocNumberForm.reset();      
  }

  removeTransmittal(index : number,depDocNumber: number){
    this.transmittalList.splice(index,1);    
    this.service.backend.deleteDepartmentDocRecord(this.transmittal.transmittalNumber,depDocNumber).subscribe();
  }

  total(){    
    return this.transmittalList.map(m=>parseInt(m.checkAmount?.toString())).reduce((a, b) => a + b, 0);
  }

}
