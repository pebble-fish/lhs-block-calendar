import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { LOCALE_ID, Inject, Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { applySourceSpanToExpressionIfNeeded } from '@angular/compiler/src/output/output_ast';

//class used to customize how to show an event - default title only

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }

  // you can override any of the methods defined in the parent class

  //customize the detail block details
  blockdetail(event: CalendarEvent): string {
    if(event.allDay)
    {
      //title - Day 1
      return `<b>${event.title}</b>`;
    }
    else if (event.title.startsWith("Lunch") || event.title.startsWith("I-block"))
    {
      //time, Lunch 1/I-block
      //return `<b>${event.title}</b> ${formatDate(event.start, 'h:mm a', this.locale)} - ${formatDate(event.end, 'h:mm a', this.locale)}`;
      return `<b>${event.title}</b> ${formatDate(event.start, 'h:mm', this.locale)} - ${formatDate(event.end, 'h:mm', this.locale)}`;
    }
    else
    {
      //time >= 49 min 59 sec (2999000) -> 2 rows, otherwise, 1 row
      //unit here - msec
      if (event.end.getTime() - event.start.getTime() >= 2999000) {
        return `<b>${event.title}</b> Room:${event.id}<br>${formatDate(event.start, 'h:mm', this.locale)} - ${formatDate(event.end, 'h:mm', this.locale)}`;
      } else {
        return `<b>${event.title}/Room:${event.id}</b> ${formatDate(event.start, 'h:mm', this.locale)} - ${formatDate(event.end, 'h:mm', this.locale)}`;
      }
      //time, location, course
    }
  }

  //use the customized block detail for display
  month(event: CalendarEvent): string
  {
    return this.blockdetail(event);
  }

  week(event: CalendarEvent): string {
    return this.blockdetail(event);
  }

  day(event: CalendarEvent): string {
    return this.blockdetail(event);
  }

  //customize the block details for tooltip
  blockdetailtooltip(event: CalendarEvent): string {
    if(event.allDay)
    {
      //title - Day 1 - disable it
      return `<b>${event.title}</b>`;
      //disable it
      //return "";
    }
    else if (event.title.startsWith("Lunch") || event.title.startsWith("I-block"))
    {
      //time, Lunch 1/I-block
      return `<b>${formatDate(event.start, 'h:mm a', this.locale)} - ${formatDate(event.end, 'h:mm a', this.locale)}</b><br>${event.title}`;
    }
    else
    {
      //time, location, course
      return `<b>${formatDate(event.start, 'h:mm a', this.locale)} - ${formatDate(event.end, 'h:mm a', this.locale)}</b><br>Room: ${event.id}<br>${event.title}`;
    }
  }

  //use customize block detail for display, including disable it
  monthTooltip(event: CalendarEvent): string {
    return this.blockdetailtooltip(event);
  }

  weekTooltip(event: CalendarEvent): string {
    return this.blockdetailtooltip(event);
  }

  dayTooltip(event: CalendarEvent): string {
    return this.blockdetailtooltip(event);
  }
}
