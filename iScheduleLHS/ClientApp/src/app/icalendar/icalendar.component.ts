import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarEventTitleFormatter, CalendarDateFormatter, DAYS_OF_WEEK, CalendarMonthViewDay } from 'angular-calendar';
import { CustomEventTitleFormatter } from './cal-custom-event-title-formatter.provider';
import { CustomDateFormatter } from './cal-custom-date-formatter.provider';
import { EventColors, EventColorArray } from './cal-event-colors';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-icalendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './icalendar.component.html',
    styleUrls: ['./icalendar.component.css'],
    providers: [
      {
        //customize event header
        provide: CalendarEventTitleFormatter,
        useClass: CustomEventTitleFormatter,
      },
      {
        //customize weekday title, i.e. from 'Monday' to 'Mon'
        provide: CalendarDateFormatter,
        useClass: CustomDateFormatter,
      }
    ],
})
/** icalendar component*/
export class IcalendarComponent implements OnInit {
    /** icalendar ctor */
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string)
  {
  }

  ngOnInit(): void {

    this.http.get<CalendarEvent<string>[]>(this.baseUrl + 'api/calendar').subscribe(result => {

      this.view = CalendarView.Month;

      this.schoolEvents = [];
      let iItemCount = 0;
      result.forEach((item) => {
        item.start = new Date(item.start);
        item.end = new Date(item.end);

        //reserve the default color for Day/Lunch
        if (!item.allDay && !item.title.startsWith("Lunch")) {
          //red [0], blue [1 - default], yellow [2]
          item.color = EventColorArray[iItemCount++ % 2 ? 2 : 0];
          //item.color = EventColorArray[iItemCount++ % 3];
        }

        this.schoolEvents.push(item);
      });

    }, error => console.error(error));
  }

  //wait until data comes back to determine the view type - otherwise, it thinks no change.
  view!: CalendarView;

  //set the default viewDate
  viewDate: Date = new Date();

  locale: string = 'en';

  //insert dummy time info to reduce the complexity of parser
  //calEvents: string = "[{\"title\":\"Day 1\",\"id\":\"\",\"start\":\"2021-09-01T00:00:00\",\"end\":\"2021-09-01T00:00:00\",\"allDay\":\"true\"},{\"title\":\"A1\",\"id\":\"A1\",\"start\":\"2021-09-01T08:30:00-04:00\",\"end\":\"2021-09-01T09:25:00-04:00\"},{\"title\":\"B1\",\"id\":\"B1\",\"start\":\"2021-09-01T09:30:00-04:00\",\"end\":\"2021-09-01T10:25:00-04:00\",\"allDay\":null},{\"title\":\"C1\",\"id\":\"C1\",\"start\":\"2021-09-01T10:30:00-04:00\",\"end\":\"2021-09-01T11:20:00-04:00\",\"allDay\":null},{\"title\":\"D1\",\"id\":\"D1\",\"start\":\"2021-09-01T11:25:00-04:00\",\"end\":\"2021-09-01T13:20:00-04:00\",\"allDay\":null},{\"title\":\"E1\",\"id\":\"E1\",\"start\":\"2021-09-01T13:25:00-04:00\",\"end\":\"2021-09-01T14:15:00-04:00\",\"allDay\":null}]";
  //schoolEvents: CalendarEvent<string>[] = JSON.parse(this.calEvents, function (key, value) {
  //  if (key == "start" || key == "end") {
  //    return new Date(value);
  //  } else {
  //    return value;
  //  }
  //});
  schoolEvents: CalendarEvent<string>[];

  // exclude weekends
  excludeDays: number[] = [0, 6];
  weekStartsOn = DAYS_OF_WEEK.SUNDAY;

  //[remove allday event from counter]
  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day) => {
      day.badgeTotal = day.events.filter(
        //(event) => event.meta.incrementsBadgeTotal
        (event) => !event.allDay && !event.title.startsWith("Lunch")
      ).length;
    });
  }

  changeDay(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Day;
  }

  CalendarView = CalendarView;

  //@Output() viewChange = new EventEmitter<CalendarView>();
  updateCalendarView(newView: CalendarView) {
    this.view = newView;
  }

  viewDateChange = new EventEmitter<Date>();

}
