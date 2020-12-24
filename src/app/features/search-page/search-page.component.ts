import { FWCService } from './../../services/fwc.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { SearchType } from 'src/app/models/search-type.enum';
import { Source } from 'src/app/models/api.notification.model';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {
  name='ronald';
  advanceSearchIndicator = true;
  constructor(private service : FWCService) {     
  }

  ngOnInit(): void {
   
  }
  search(val : string){       
    this.service.backend.departmentDocumentSearch(SearchType.Simple, val).subscribe();  
  }

  get status(){
     var record =this.service.retrieve(Source.TransmittalSearch);
     return record.status.isCompleted && record.data.length==0 ? ' : No Match Found':'';
  }

 
}
