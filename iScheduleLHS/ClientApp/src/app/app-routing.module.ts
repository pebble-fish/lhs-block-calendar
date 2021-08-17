import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { IcalendarComponent } from './icalendar/icalendar.component';
import { IcourseBlocksMapComponent } from './icourse-blocks-map/icourse-blocks-map.component';
import { CourseBlocksEditComponent } from './icourse-blocks-map/course-blocks-edit.component';
import { IlunchScheduleComponent } from './ilunch-schedule/ilunch-schedule.component';

import { AuthGuard } from './_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);

const routes: Routes = [
    //{ path: '', component: HomeComponent, pathMatch: 'full' },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'calendar', component: IcalendarComponent, canActivate: [AuthGuard] },
    { path: 'courseblocks', component: IcourseBlocksMapComponent, canActivate: [AuthGuard] },
    { path: 'courseinfo/:id', component: CourseBlocksEditComponent, canActivate: [AuthGuard] },
    { path: 'courseinfo', component: CourseBlocksEditComponent, canActivate: [AuthGuard] },
    { path: 'lunches', component: IlunchScheduleComponent, canActivate: [AuthGuard] },
    { path: 'omg/users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
