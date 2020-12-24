import { TransmittalSearchResponse } from './../../models/transmittalSearchResponse';
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
export class DataTableSearchDataSource extends DataSource<TransmittalSearchResponse> {
  // data: DataTableSearchItem[] = EXAMPLE_DATA;
  data: TransmittalSearchResponse[];;

  paginator: MatPaginator;
  sort: MatSort;

  constructor(private records :TransmittalSearchResponse[]) {
    super();
    this.data=records;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TransmittalSearchResponse[]> {
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
  private getPagedData(data: TransmittalSearchResponse[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TransmittalSearchResponse[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'firstName': return compare(a.firstName, b.firstName, isAsc);
        case 'lastName': return compare(+a.lastName, +b.lastName, isAsc);
        case 'departmentDocumentNumber': return compare(a.departmentDocumentNumber, b.departmentDocumentNumber, isAsc);
        case 'checkAmount': return compare(+a.checkAmount, +b.checkAmount, isAsc);
        case 'checkNumber': return compare(a.checkNumber, b.checkNumber, isAsc);
        case 'transmittalNumber': return compare(+a.transmittalNumber, +b.transmittalNumber, isAsc);
        case 'cashListing': return compare(+a.cashListing, +b.cashListing, isAsc);
        case 'transmittalStatus': return compare(+a.transmittalStatus, +b.transmittalStatus, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
