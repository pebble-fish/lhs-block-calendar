import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CourseInfo } from './courseinfo';

@Component({
  selector: 'app-icourse-blocks-map',
  templateUrl: './icourse-blocks-map.component.html',
  styleUrls: ['./icourse-blocks-map.component.css']
})
/** icourse-blocks-map component*/
export class IcourseBlocksMapComponent implements OnInit {
  /** icourse-blocks-map ctor */
  public displayedColumns: string[] = ['id', 'title', 'room', 'blocks'];
  public courseInfos: MatTableDataSource<CourseInfo>;

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "title";
  public defaultSortOrder: string = "asc";

  defaultFilterColumn: string = "title";
  filterQuery: string = null;

  //true - make component available in OnInit
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  filterTextChanged: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  ngOnInit() {
    this.loadData(null);
  }

  // debounce filter text changes
  onFilterTextChanged(filterText: string) {
    if (this.filterTextChanged.observers.length === 0) {
      this.filterTextChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(query => {
          this.loadData(query);
        });
    }
    this.filterTextChanged.next(filterText);
  }

  loadData(query: string = null) {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    if (query) {
      this.filterQuery = query;
    }
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    var url = this.baseUrl + 'api/courseinfos';
    var params = new HttpParams()
      .set("pageIndex", event.pageIndex.toString())
      .set("pageSize", event.pageSize.toString())
      .set("sortColumn", (this.sort && this.sort.active)
            ? this.sort.active
            : this.defaultSortColumn)
      .set("sortOrder", (this.sort.direction)
        ? this.sort.direction
        : this.defaultSortOrder);


    if (this.filterQuery) {
      params = params
        .set("filterColumn", this.defaultFilterColumn)
        .set("filterQuery", this.filterQuery);
    }

    this.http.get<any>(url, { params })
      .subscribe(result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.courseInfos = new MatTableDataSource<CourseInfo>(result.data);
      }, error => console.error(error));
  }
}
