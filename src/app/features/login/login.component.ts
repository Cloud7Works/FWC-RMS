import { FWCService } from './../../services/fwc.service';
import { TransmittalSearchResponse } from './../../models/transmittalSearchResponse';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { emailValidator } from '../form-validators/email.validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router : Router, private service : FWCService) { }
  loginForm = new FormGroup({
    username:new FormControl('',[Validators.required,Validators.email,emailValidator("fwc.gov")]),
    password:new FormControl('',Validators.required)
  });
  ngOnInit(): void {
  
  }
  
  login(){
    var obj ={
      "firstName": "a",
      "lastName": "string",
      "companyName": "string",
      "departmentDocumentNumber": "string",
      "ddnSearchType": "string",
      "checkNumber": "string",
      "depositNumber": "string",
      "transmittalNumber": 0,
      "transmittalStatus": "string",
      "checkAmount": 0,
      "cashListing": "string",
      "eoCode": "string",
      "objectCode": "string",
      "depositDateFrom": "2020-12-17",
      "depositDateTo": "2020-12-17"
    };    
    this.router.navigate(['/home']);
  }
}
