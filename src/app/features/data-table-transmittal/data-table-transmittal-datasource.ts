import { TransmittalResponse } from './../../models/transmittalResponse';
import { TransmittalSearchResponse } from '../../models/transmittalSearchResponse';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';


/**
 * Data source for the DataTableSearch view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DataTableTransmittalDataSource extends DataSource<TransmittalResponse> {
  // data: DataTableSearchItem[] = EXAMPLE_DATA;
  data: TransmittalResponse[];;

  paginator: MatPaginator;
  sort: MatSort;

  constructor(private records :TransmittalResponse[]) {
    super();
    this.data=records;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TransmittalResponse[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];    
    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: TransmittalResponse[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TransmittalResponse[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'transmittalNumber': return compare(a.transmittalNumber, b.transmittalNumber, isAsc);
        case 'transmittalDate': return compare(+a.transmittalDate, +b.transmittalDate, isAsc);
        case 'transmittalTotalCount': return compare(a.transmittalTotalCount, b.transmittalTotalCount, isAsc);
        case 'transmittalTotal': return compare(+a.transmittalTotal, +b.transmittalTotal, isAsc);
        case 'transmittalStatus': return compare(a.transmittalStatus, b.transmittalStatus, isAsc);       
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
