import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { IcourseBlocksMapComponent } from './icourse-blocks-map.component';

let component: IcourseBlocksMapComponent;
let fixture: ComponentFixture<IcourseBlocksMapComponent>;

describe('icourse-blocks-map component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ IcourseBlocksMapComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(IcourseBlocksMapComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});
