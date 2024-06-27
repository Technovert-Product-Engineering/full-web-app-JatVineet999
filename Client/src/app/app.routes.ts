import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { LayoutComponent } from './components/layout/layout.component';
import { UserAuthComponent } from './components/user-auth/user-auth.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

    {
        // canActivate: [authGuard],
        path: '', redirectTo: 'login', pathMatch: 'full'
    },
    {
        // canActivate: [authGuard],
        path: 'login', component: UserAuthComponent
    },
    {
        // canActivate: [authGuard],
        path: 'signup', component: UserAuthComponent
    },
    {
        // canActivate: [authGuard],
        path: '',
        component: LayoutComponent,
        children: [
            {
                // canActivate: [authGuard],
                path: 'dashboard', component: DashboardComponent
            },
            {
                // canActivate: [authGuard],
                path: 'tasks', component: TasksComponent
            },
            {
                // canActivate: [authGuard],
                path: 'tasks/active', component: TasksComponent, data: { filter: 'active' }
            },
            {
                // canActivate: [authGuard],
                path: 'tasks/completed', component: TasksComponent, data: { filter: 'completed' }
            },
        ]
    }
];
