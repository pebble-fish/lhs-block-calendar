import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { IlunchScheduleComponent } from './ilunch-schedule.component';

let component: IlunchScheduleComponent;
let fixture: ComponentFixture<IlunchScheduleComponent>;

describe('ilunch-schedule component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ IlunchScheduleComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(IlunchScheduleComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});
