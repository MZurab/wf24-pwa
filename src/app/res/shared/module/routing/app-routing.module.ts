import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {LoginComponent} from '../../../../(1) Login/component/login/login.component';
import {LkComponent} from '../../../../(2) LK/component/lk/lk.component';
// import {Lk2Component} from '../../../../(2) LK/component/lk2/lk2.component';
import {TaskListComponent} from '../../../../(2) LK/component/lk/subView/task-list/task-list.component';
import {TaskPageComponent} from '../../../../(2) LK/component/lk/subView/task-page/task-page.component';
import {NotFoundComponent} from '../../../../(2) LK/component/lk/subView/not-found/not-found.component';
import {ConnectAuthGuardService} from '../../../../ConnectSystem/res/shared/service/user/connect-auth.guard.service';
import {WorksTableComponent} from '../../../../(2) LK/component/lk/subView/works-table/works-table.component';

const routesArray = [
  {
    'path'      : '',
    'pathMatch': 'full',
    'redirectTo': 'lk',
    canActivate:  [ConnectAuthGuardService]
  },
  {
    path      : 'lk',
    pathMath  : 'full',
    component : LkComponent,
    canActivate:  [ConnectAuthGuardService],
    children  : [
      {
        'path'      : '',
        'pathMatch' : 'full',
        'redirectTo': 'tasks'
      },
      {
        'path'      : 'works',
        'component' : WorksTableComponent
      },
      {
        'path'      : 'tasks',
        'component' : TaskListComponent
      },
      {
        'path'      : 'taskform',
        'component' : TaskPageComponent
      },
      {
        'path'      : 'notFound',
        'component' : NotFoundComponent
      }
    ]
  },
  {
    path : 'login',
    canActivate:  [ConnectAuthGuardService],
    component: LoginComponent
  },
  {
    path : '**',
    redirectTo: 'login'
  }
]

@NgModule({
  imports : [RouterModule.forRoot(routesArray)],
  exports : [RouterModule]
})
export class AppRoutingModule { }
