import { FWCService } from './../../services/fwc.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { SearchType } from 'src/app/models/search-type.enum';
import { Source } from 'src/app/models/api.notification.model';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent {  
  advanceSearchIndicator = true;
  isReset = false;
  constructor(private service : FWCService) {     
  }

  search(val : string, type : SearchType = SearchType.Simple){       
    this.isReset=type==SearchType.Default;
    if(this.isReset || val!==""){
      this.service.backend.departmentDocumentSearch(type, val).subscribe();  
    }    
  }

  clear(){    
    this.search('',SearchType.Default);
  }

  get status(){
     var record =this.service.retrieve(Source.TransmittalSearch);
     return record.status.isCompleted && record.data.length==0  && !this.isReset? 'No Match Found':'';
  }

 
}
