import { filter, tap } from 'rxjs/operators';
import { FWCService } from './../../services/fwc.service';
import { TransmittalSearchResponse } from './../../models/transmittalSearchResponse';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { DataTableSearchDataSource } from './data-table-search-datasource';
import { Source } from '../../models/api.notification.model';

@Component({
  selector: 'data-table-search',
  templateUrl: './data-table-search.component.html',
  styleUrls: ['./data-table-search.component.scss']
})
export class DataTableSearchComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<TransmittalSearchResponse>;
  dataSource: DataTableSearchDataSource;
constructor(private service : FWCService,private detector : ChangeDetectorRef){
}
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [ 'lastName',
                      'firstName',
                      'departmentDocumentNumber',
                      'checkAmount',
                      'checkNumber',                      
                      'transmittalNumber',
                      'cashListing',
                      'transmittalStatus'];
 
  ngAfterViewInit() {
    this.service.notifier.pipe(tap((f)=>{
      if(f.source==Source.TransmittalSearch){
        var data = this.service.retrieve(Source.TransmittalSearch).data;
        this.setSource(data);
      }
     
    })).subscribe();
  }

ngOnInit(): void {  
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
    setTimeout(() => {
      var data = this.service.retrieve(Source.TransmittalSearch).data;    
      if(!this.dataSource && data.length!==0){     
        this.setSource(data);
      }
    }, 100);
  }

  setSource(data:any[]){
    this.dataSource = new DataTableSearchDataSource(data);            
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
