import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CourseInfo } from './courseinfo';

@Component({
    selector: 'app-course-blocks-edit',
    templateUrl: './course-blocks-edit.component.html',
    styleUrls: ['./course-blocks-edit.component.css']
})
/** course-blocks-edit component*/
export class CourseBlocksEditComponent implements OnInit{
  // the view title
  title: string;
  // the form model
  form: FormGroup;
  // the CourseInfo object to edit
  courseInfo: CourseInfo;

  //all valid block options
  candidateBlocks: Set<string>;
  selectedBlocks: string[];
  formChipControl: FormControl;

  // the CourseInfo object id, as fetched from the active route:
  // It's NULL when we're adding a new course,
  // and not NULL when we're editing an existing one.
  id?: number;

  /** course-blocks-edit ctor */
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  //course title can repeat - such as study hall
  ngOnInit() {

    this.formChipControl = new FormControl('');

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      room: new FormControl('', Validators.required),
      blocks: new FormControl(''),
      chipsControl: this.formChipControl,
    }, null, this.isDupeCourse());

    //get all valida block options
    this.loadBlockOptions();

    //get individual course info if applicable
    this.loadCourseInfoData();
  }

  loadBlockOptions() {

    // retrieve the ID from the 'id'
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');

    //load block options
    var courseId = (this.id) ? this.id : 0;
    var urlOptions = this.baseUrl + "api/courseinfos/validoptions/" + courseId;
    this.http.get<Set<string>>(urlOptions).subscribe(result => {
      this.candidateBlocks = result;
      // update the form with the course value
      this.form.patchValue(this.candidateBlocks);
    }, error => console.error(error));
  }

  loadCourseInfoData() {

    // retrieve the ID from the 'id'
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');

    if (this.id) {
      // EDIT MODE
      // fetch the CourseInfo from the server based on CourseInfo's Id
      var url = this.baseUrl + "api/courseinfos/" + this.id;
      this.http.get<CourseInfo>(url).subscribe(result => {
        //get course info
        this.courseInfo = result;
        //select blocks associated with course already
        var blocks2Select = this.courseInfo.blocks.split(",");
        this.formChipControl.setValue(blocks2Select);

        this.title = "Edit - " + this.courseInfo.title;
        // update the form with the course value
        this.form.patchValue(this.courseInfo);
      }, error => console.error(error));
    }
    else {
      // ADD NEW MODE
      this.title = "Create a new Course";
    }
  }

  onSubmit() {

    var courseInfo = (this.id) ? this.courseInfo : <CourseInfo>{};
    courseInfo.title = this.form.get("title").value;
    courseInfo.room = this.form.get("room").value;
    if (this.formChipControl.value.length > 0) {
      let iArraySize = this.formChipControl.value.length;
      var blockArray: string[] = new Array(iArraySize);
      for (let i = 0; i < iArraySize; i++) {
        blockArray[i] = this.formChipControl.value[i];
      }
      blockArray = blockArray.sort();
      //courseInfo.blocks = this.formChipControl.value.join(",");
      courseInfo.blocks = blockArray.join(",");
    }
    else {
      courseInfo.blocks = "";
    }

    if (this.id) {
      // EDIT mode
      var url = this.baseUrl + "api/courseinfos/" + this.courseInfo.id;

      this.http
        .put<CourseInfo>(url, courseInfo)
        .subscribe(result => {
          console.log("CourseInfo " + courseInfo.id + " has been updated.");
          // go back to cities view
          this.router.navigate(['/courseblocks']);
        }, error => console.error(error));
    }
    else {
      // ADD NEW mode
      var url = this.baseUrl + "api/courseinfos";

      courseInfo.id = 0;
      courseInfo.userId = 0;

      this.http
        .post<CourseInfo>(url, courseInfo)
        .subscribe(result => {
          console.log("CourseInfo " + result.id + " has been created.");
          // go back to Courses view
          this.router.navigate(['/courseblocks']);
        }, error => console.error(error));
    }
  }

  onDelete() {

    if (this.id) {
      // EDIT mode
      var url = this.baseUrl + "api/courseinfos/" + this.id;

      this.http
        .delete<CourseInfo>(url)
        .subscribe(result => {
          console.log("CourseInfo " + this.id + " has been deleted.");
          // go back to courses' view
          this.router.navigate(['/courseblocks']);
        }, error => console.error(error));
    }
  }


  isDupeCourse(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {

      //does different courses have the same block(s)
      var courseInfo = <CourseInfo>{};
      courseInfo.id = (this.id) ? this.id : 0;
      courseInfo.title = this.form.get("title").value;
      courseInfo.room = this.form.get("room").value;
      courseInfo.blocks = this.form.get("blocks").value;

      var url = this.baseUrl + "api/courseinfos/isdupecourse";
      return this.http.post<boolean>(url, courseInfo).pipe(map(result => {
        return (result ? { isDupeCourse: true } : null);
      }));
    }
  }
}
