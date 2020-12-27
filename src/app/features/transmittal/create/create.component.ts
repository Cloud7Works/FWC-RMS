import { TransmittalDetailModel } from './../../../models/transmittal-detail.model';
import { TransmittalResponse } from './../../../models/transmittalResponse';
import { CreateTransmittalDetailRequest } from './../../../models/createTransmittalDetailRequest';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Source } from '../../../models/api.notification.model';
import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { FWCService } from '../../../services/fwc.service';
import { TransmittalSteps } from '../transmittal-steps.enum';
import { numberWithCommas } from '../../../helper/helper-methods';
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
  constructor(private service : FWCService, private detector:ChangeDetectorRef) {    
    
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
    return val!==null && val.trim()!=="";
  }

  setDefaultValidators(){
    if(!this.hasValue(this.getFormControl('companyName').value)){
      this.getFormControl('companyName').reset();
    }
    if(!this.hasValue(this.getFormControl('firstName').value)){
      this.getFormControl('firstName').reset();
    }
    if(!this.hasValue(this.getFormControl('lastName').value)){
      this.getFormControl('lastName').reset();
    }
    if(!this.hasValue(this.getFormControl('firstName').value) && !this.hasValue(this.getFormControl('lastName').value)){
      this.getFormControl('companyName').enable({onlySelf:true});
    }
    // this.getFormControl('firstName').setValidators([Validators.required]);  
    // this.getFormControl('lastName').setValidators([Validators.required]);
    // this.getFormControl('companyName').setValidators([Validators.required]);
     
    this.depDocNumberForm.updateValueAndValidity();
  }

  setRequiredValidators(){
    this.getFormControl('companyName').disable({onlySelf:true});
    this.getFormControl('firstName').setValidators([Validators.required]);  
    this.getFormControl('lastName').setValidators([Validators.required]);
    this.getFormControl('companyName').setValidators([Validators.required]);
    if(!this.hasValue(this.getFormControl('lastName').value)){
      this.getFormControl('lastName').setErrors(Validators.required);
      this.getFormControl('lastName').markAsTouched();
    }

    if(!this.hasValue(this.getFormControl('firstName').value)){
      this.getFormControl('firstName').setErrors(Validators.required);
      this.getFormControl('firstName').markAsTouched();
    }

    this.depDocNumberForm.updateValueAndValidity();
  }

  disableField:boolean;
  ngOnInit(): void {    
    this.getFormControl('firstName').valueChanges.pipe(debounceTime(300),distinctUntilChanged()).subscribe(d=>{
      if(!this.hasValue(d) && !this.hasValue(this.getFormControl('lastName').value)){
        this.setDefaultValidators();           
      }else {
        this.setRequiredValidators();   
      }
      this.depDocNumberForm.updateValueAndValidity();
    });

    this.getFormControl('lastName').valueChanges.pipe(debounceTime(300),distinctUntilChanged()).subscribe(d=>{
      if(!this.hasValue(d) && !this.hasValue(this.getFormControl('firstName').value)){
        this.setDefaultValidators();          
      }else {        
        this.setRequiredValidators();    
      }
      this.depDocNumberForm.updateValueAndValidity();
    });

    this.getFormControl('companyName').valueChanges.pipe(debounceTime(300),distinctUntilChanged()).subscribe(d=>{
      if(this.hasValue(d)){
        this.getFormControl('firstName').disable({onlySelf:true});
        this.getFormControl('lastName').disable({onlySelf:true});
      }else{
        this.getFormControl('firstName').enable({onlySelf:true});
        this.getFormControl('lastName').enable({onlySelf:true});
        this.setDefaultValidators();
      }
    });

  }

  getFormattedAmount(amount:number){
    return numberWithCommas(amount);
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
  
  private setFormValue(record:TransmittalDetailModel){
    this.depDocNumberForm.patchValue({
      "checkNumber": record.checkNumber,
      "firstName": record.firstName,
      "lastName": record.lastName,
      "companyName": record.companyName,
      "checkAmount": record.checkAmount,
      "cashListing": record.cashListing,
      "comments": record.comments
    }); 
    this.depDocNumberForm.updateValueAndValidity();
  }

  get deptRec(){
    var record = this.transmittalList.find(f=>!f.readOnly);
    return record?.departmentDocumentNumber;
  }
  
  total(){    
    return this.getFormattedAmount(this.transmittalList.map(m=>parseFloat(m.checkAmount?.toString())).reduce((a, b) => a + b, 0));
  }

}
