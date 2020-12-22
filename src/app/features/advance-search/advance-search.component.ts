import { TransmittalSearchRequest } from './../../models/transmittalSearchRequest';
import { FormGroup, FormControl } from '@angular/forms';
import { FWCService } from './../../services/fwc.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SearchType } from './../../models/search-type.enum';
import { formatDateRange } from '../../helper/helper-methods';

@Component({
  selector: 'advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss']
})
export class AdvanceSearchComponent implements OnInit {
  startDate : string;
  endDate : string;
  date = new Date();
  constructor(private service : FWCService) { }

  ngOnInit(): void { 
  }

  setDate(type: string, event: any) {
    if(type=='start'){
      this.startDate=event.value.toISOString().split('T')[0];
    }else{
      this.endDate=event.value.toISOString().split('T')[0];
    }    
  }

  searchForm = new FormGroup({
      "firstName":new FormControl(""),
      "lastName": new FormControl(""),
      "companyName": new FormControl(""),
      "departmentDocumentNumber": new FormControl(""),
      "doc": new FormControl(""),
      "ddnSearchType": new FormControl(""),
      "checkNumber": new FormControl(""),
      "depositNumber": new FormControl(""),
      "transmittalNumber": new FormControl(""),
      "transmittalStatus": new FormControl(""),
      "checkAmount": new FormControl(""),
      "cashListing": new FormControl(""),
      "eoCode": new FormControl(""),
      "objectCode": new FormControl(""),
      "depositDateFrom": new FormControl(""),
      "depositDateTo":new FormControl("")
  });


  search(){          
    var dateRange=formatDateRange(this.searchForm.get('depositDateFrom').value,this.searchForm.get('depositDateTo').value);      
    var payload : TransmittalSearchRequest =this.searchForm.value;
    payload.depositDateFrom = dateRange.start;
    payload.depositDateTo= dateRange.end;    
    this.service.backend.departmentDocumentSearch(SearchType.Advanced, payload).subscribe();
  }

}
