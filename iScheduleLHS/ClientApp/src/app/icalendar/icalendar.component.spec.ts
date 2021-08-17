import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { IcalendarComponent } from './icalendar.component';

let component: IcalendarComponent;
let fixture: ComponentFixture<IcalendarComponent>;

describe('icalendar component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ IcalendarComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(IcalendarComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});
