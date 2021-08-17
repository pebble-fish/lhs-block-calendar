/// <reference path="../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CourseBlocksEditComponent } from './course-blocks-edit.component';

let component: CourseBlocksEditComponent;
let fixture: ComponentFixture<CourseBlocksEditComponent>;

describe('course-blocks-edit component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CourseBlocksEditComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CourseBlocksEditComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});