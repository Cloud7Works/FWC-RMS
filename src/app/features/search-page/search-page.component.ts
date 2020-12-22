import { FWCService } from './../../services/fwc.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { SearchType } from 'src/app/models/search-type.enum';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {
  advanceSearchIndicator = true;
  constructor(private service : FWCService) {     
  }

  ngOnInit(): void {
   
  }
  search(val : string){       
    this.service.backend.departmentDocumentSearch(SearchType.Simple, val).subscribe();  
  }

 
}
