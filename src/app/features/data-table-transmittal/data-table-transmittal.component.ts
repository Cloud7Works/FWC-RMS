import { TransmittalResponse } from './../../models/transmittalResponse';
import { filter, map, tap } from 'rxjs/operators';
import { FWCService } from '../../services/fwc.service';
import { TransmittalSearchResponse } from '../../models/transmittalSearchResponse';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { DataTableTransmittalDataSource } from './data-table-transmittal-datasource';
import { Source } from '../../models/api.notification.model';
import { numberWithCommas } from '../../helper/helper-methods';

@Component({
  selector: 'data-table-transmittal',
  templateUrl: './data-table-transmittal.component.html',
  styleUrls: ['./data-table-transmittal.component.scss']
})
export class DataTableTransmittalComponent implements AfterViewInit {
  @Output() onEditting = new EventEmitter<{edit:boolean,transmittal:TransmittalResponse}>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<TransmittalResponse>;
  _dataSource: DataTableTransmittalDataSource;
  get dataSource(){
    return this._dataSource;
  }
constructor(private service : FWCService){
}
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['transmittalNumber',
                      'transmittalDate',
                      'transmittalTotalCount',
                      'transmittalTotal',
                      'transmittalStatus','edit'];
 ngOnInit(): void {
   //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   //Add 'implements OnInit' to the class.  
   this.service.backend.getTransmittals().subscribe();
 }

  ngAfterViewInit() {
    this.service.notifier.pipe(filter(f=>f.source==Source.TransmittalSummary),tap(()=>{
      var data = this.service.retrieve(Source.TransmittalSummary).data;      
      this._dataSource = new DataTableTransmittalDataSource(data);           
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
     })).subscribe();
  }

  edit(transmittal:TransmittalResponse){
    this.onEditting.emit({edit:true,transmittal:transmittal});
  }

  formatAmount(amount : number){
    return numberWithCommas(amount);
  }
}
