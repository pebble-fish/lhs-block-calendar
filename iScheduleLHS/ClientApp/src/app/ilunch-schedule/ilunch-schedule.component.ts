import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LunchSchedule } from './lunchschedule';

@Component({
    selector: 'app-ilunch-schedule',
    templateUrl: './ilunch-schedule.component.html',
    styleUrls: ['./ilunch-schedule.component.css']
})
/** ilunch-schedule component*/
export class IlunchScheduleComponent implements OnInit {
  /** ilunch-schedule ctor */

  // the view title
  title: string;
  // the form model
  form: FormGroup;

  // the CourseInfo object to edit
  lunchSchedule: LunchSchedule;
  // the LunchInfo object id, as fetched from the active route:
  // It's NULL when we don't have a lunch schedule yet
  // and not NULL when we're editing an existing one.
  id?: number;

  bIsEditingSchedule: boolean = false;

  //set up lunch option form
  schoolDays = [0, 1, 2, 3, 4, 5];
  schoolDayLabels: string[] = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];
  lunchOptions = new Set(['Lunch 1', 'Lunch 2', 'Lunch 3', 'Lunch 4']);
  formControls!: Array<FormControl>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  //course title can repeat - such as study hall
  ngOnInit() {

    this.title = "Create your lunch schedule";

    this.formControls = [new FormControl(['']), new FormControl(['']),
    new FormControl(['']), new FormControl(['']), new FormControl(['']),
    new FormControl([''])];

    this.form = new FormGroup({
      day1: this.formControls[0],
      day2: this.formControls[1],
      day3: this.formControls[2],
      day4: this.formControls[3],
      day5: this.formControls[4],
      day6: this.formControls[5],
    });

    this.loadLunchShcedule();
  }

  loadLunchShcedule() {
    //get data from server on currently selection
    // fetch the CourseInfo from the server based on CourseInfo's Id
    var url = this.baseUrl + "api/lunchschedule";
    this.http.get<LunchSchedule>(url).subscribe(result => {
      //get course info
      this.lunchSchedule = result;

      if (this.lunchSchedule !== null && this.lunchSchedule !== undefined) {

        //set id
        this.id = this.lunchSchedule.id;

        //get existing lunch schedule from server
        this.title = "Edit your lunch schedule";

        //select blocks associated with course already
        var blocks2Select = this.lunchSchedule.schedules.split(",");
        if (blocks2Select.length == 6) {
          for (let i = 0; i < 6; i++) {
            if (blocks2Select[i] !== null && blocks2Select[i] !== undefined && blocks2Select[i] != "" ) {
              this.formControls[i].setValue(blocks2Select[i]);
            }
          }
        }
        // update the form with the course value
        this.form.patchValue(this.lunchSchedule);
      }

      this.onEndEditing();

    }, error => console.error(error));
  }

  onSubmit() {

    var lunchSchedule = (this.id) ? this.lunchSchedule : <LunchSchedule>{};

    let lunchSelection: string = "";
    for (let i = 0; i < 6; i++) {
      lunchSelection += (this.formControls[i].value !== null && this.formControls[i].value !== undefined) ? this.formControls[i].value : "";
      if (i != 5) {
        lunchSelection += ",";
      }
    }
    lunchSchedule.schedules = lunchSelection;

    if (this.id) {
      // EDIT mode
      var url = this.baseUrl + "api/lunchschedule/" + this.lunchSchedule.id;

      this.http
        .put<LunchSchedule>(url, lunchSchedule)
        .subscribe(result => {
          console.log("LunchSchedule " + lunchSchedule.id + " has been updated.");

          //TODO: should disbale the "Save" or "Submit" or "Cancel" button

        }, error => console.error(error));
    }
    else {
      // ADD NEW mode
      var url = this.baseUrl + "api/lunchschedule";

      lunchSchedule.id = 0;
      lunchSchedule.userId = 0;

      this.http
        .post<LunchSchedule>(url, lunchSchedule)
        .subscribe(result => {
          console.log("LunchSchedule " + result.id + " has been created.");
          
          //TODO: should disbale the "Save" or "Submit" or "Cancel" button
          
        }, error => console.error(error));
    }

    this.onEndEditing();
  }

  onCancel() {
    
    if (this.id) {
      //re-apply data from server
      //get data from server on currently selection
      // fetch the CourseInfo from the server based on CourseInfo's Id
      var url = this.baseUrl + "api/lunchschedule/" + this.id;
      this.http.get<LunchSchedule>(url).subscribe(result => {
        //get course info
        if (result !== null && result !== undefined ) {

          if (this.lunchSchedule != result) {

            this.lunchSchedule = result;

            //select blocks associated with course already
            var blocks2Select = this.lunchSchedule.schedules.split(",");
            if (blocks2Select.length == 6) {
              for (let i = 0; i < 6; i++) {
                if (blocks2Select[i] !== null && blocks2Select[i] !== undefined && blocks2Select[i] != "") {
                  this.formControls[i].setValue(blocks2Select[i]);
                }
              }
            }
            // update the form with the course value
            this.form.patchValue(this.lunchSchedule);
          }
        }
      }, error => console.error(error));
    } else {
      //clean up locally
      for (let i = 0; i < 6; i++) {
        this.formControls[i].setValue("");
      }
    }

    this.onEndEditing();
  }

  onStartEditing() {
    this.bIsEditingSchedule = true;
    for (let i = 0; i < 6; i++)
    {
      this.formControls[i].enable();
    }
  }

  onEndEditing() {
    this.bIsEditingSchedule = false;
    for (let i = 0; i < 6; i++) {
      this.formControls[i].disable();
    }
  }
}
