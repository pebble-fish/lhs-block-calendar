import { CalendarDateFormatter, DateFormatterParams, DateAdapter } from 'angular-calendar';
import { LOCALE_ID, Inject, Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

//class used to customize calendar's day (long [Sunday - Satureday] - default; customize to short [Sun - Sat] if needed)

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string, public dateAdapter : DateAdapter) {
    super(dateAdapter);
   }
  // you can override any of the methods defined in the parent class
  public monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'EEE', this.locale);
  }

  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'EEE', this.locale);
  }

  //public dayViewHour({ date, locale }: DateFormatterParams): string {
  //  return formatDate(date, 'HH:mm', this.locale);
  //}
}
