import { TransmittalDetailModel } from './../../../models/transmittal-detail.model';
import { TransmittalResponse } from './../../../models/transmittalResponse';
import { CreateTransmittalDetailRequest } from './../../../models/createTransmittalDetailRequest';
import { tap, filter, map, switchMap } from 'rxjs/operators';
import { TransmittalDetailResponse } from './../../../models/transmittalDetail';
import { Source } from '../../../models/api.notification.model';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { FWCService } from '../../../services/fwc.service';
import { TransmittalSteps } from '../transmittal-steps.enum';
export enum FormAction {
  Read = 'read',
  Save = 'save'
}
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
  constructor(private service : FWCService) {    
   }
  steps=TransmittalSteps;
  cashListings=["Saltwater","Freshwater","Misc"];
  @Input('transmittalStep') transmittalStep : TransmittalSteps = TransmittalSteps.Submit;
  @Output('hideSendVerification') hideSendVerification = new EventEmitter<boolean>();
  get transmittalList() : TransmittalDetailModel[]{
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
    this.depDocNumberForm.get('comments').valueChanges.subscribe(d=>{
      console.log(this.depDocNumberForm.controls);
    });
  }

  requestDeptDocNumber(){ 
    var payload : CreateTransmittalDetailRequest = this.depDocNumberForm.value;   
      
    this.service.backend.createDepartmentDocumentNumber(this.transmittal.transmittalNumber,payload).
    pipe(switchMap(()=>{
      var transmittalList =  this.service.retrieve(Source.TransmittalList).data;          
      var totalCheckAmount = transmittalList.map(m=>parseInt(m.checkAmount)).reduce((a, b) => a + b, 0);         
      var payload ={
        "transmittalTotalCount":transmittalList.length,
        "transmittalTotal": totalCheckAmount,
        "transmittalStatus": "Data Entry"
      }    
      return this.service.backend.updateTransmittal(this.transmittal.transmittalNumber,payload);
    })).subscribe();   
    this.depDocNumberForm.reset();      
  }

  deleteDepartmentDocumentRecord(index : number,depDocNumber: number){
    this.transmittalList.splice(index,1);    
    var transmittal = this.service.retrieve(Source.TransmittalCreation).data[0];                   
    this.service.backend.deleteDepartmentDocRecord(this.transmittal.transmittalNumber,depDocNumber).pipe(switchMap(()=>{
      var transmittalList =  this.service.retrieve(Source.TransmittalList).data;          
      var totalCheckAmount = transmittalList.map(m=>parseInt(m.checkAmount)).reduce((a, b) => a + b, 0);         
      var payload ={
        "transmittalTotalCount":transmittalList.length,
        "transmittalTotal": totalCheckAmount,
        "transmittalStatus": "Data Entry"
      }    
      return this.service.backend.updateTransmittal(transmittal.transmittalNumber,payload);
    })).subscribe();
  }

  isReadOnly = true;  
  action = FormAction;
  formAction : FormAction = FormAction.Read;
  editDepartmentDocumentRecord(type: FormAction,record:TransmittalDetailModel){    
    this.isReadOnly = !this.isReadOnly;    
    var doc = this.transmittalList.find(f=>f.departmentDocumentNumber==record.departmentDocumentNumber);
    doc.readOnly = this.isReadOnly;       
    this.formAction=type==FormAction.Save?FormAction.Read:FormAction.Save;
    if(type==FormAction.Save){                                      
      var payload : CreateTransmittalDetailRequest = this.depDocNumberForm.value;      
      this.service.backend.updateDeptDocRecord(this.transmittal.transmittalNumber,record.departmentDocumentNumber,payload,doc).subscribe();
      this.depDocNumberForm.reset();
      this.hideSendVerification.emit(false);
    }  else{
      this.setFormValue(record);
      this.hideSendVerification.emit(true);
    }    
  }

  private setControlValue(name:string,val:any){
    this.depDocNumberForm.get(name).setValue(val);
  }
  
  private setFormValue(record:TransmittalDetailModel){
    this.setControlValue("checkNumber", record.checkNumber);
    this.setControlValue("firstName", record.firstName);
    this.setControlValue("lastName", record.lastName);
    this.setControlValue("companyName", record.companyName);
    this.setControlValue("checkAmount", record.checkAmount);
    this.setControlValue("cashListing", record.cashListing);
    this.setControlValue("comments", record.comments);
  }
  
  total(){    
    return this.transmittalList.map(m=>parseFloat(m.checkAmount?.toString())).reduce((a, b) => a + b, 0);
  }

}
