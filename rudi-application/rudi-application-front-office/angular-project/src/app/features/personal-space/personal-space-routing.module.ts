import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {mapToCanActivate, RouterModule, Routes} from '@angular/router';
import {AuthGuardService as AuthGuard} from '@core/services/auth-guard.service';
import {OwnerGuardService} from '@core/services/owner-guard.service';
import {UserGuardService} from '@core/services/user-guard.service';
import {ModeratorAdminGuardService} from '@core/services/moderator-admin-guard.service';
import {
    LinkedProducerTaskDetailComponent
} from '@features/personal-space/pages/linked-producer-task-detail/linked-producer-task-detail.component';
import {OrganizationTaskDetailComponent} from '@features/personal-space/pages/organization-task-detail/organization-task-detail.component';
import {ProjectDetailComponent} from './components/project-detail/project-detail.component';
import {DatasetTaskDetailComponent} from './pages/dataset-task-detail/dataset-task-detail.component';
import {MyAccountComponent} from './pages/my-account/my-account.component';
import {MyActivityComponent} from './pages/my-activity/my-activity.component';
import {MyNotificationsComponent} from './pages/my-notifications/my-notifications.component';
import {ModerationCenterComponent} from './pages/moderation-center/moderation-center.component';
import {MyProjectDetailsComponent} from './pages/my-project-details/my-project-details.component';
import {NewRequestTaskDetailComponent} from './pages/new-request-task-detail/new-request-task-detail.component';
import {ProjectTaskDetailComponent} from './pages/project-task-detail/project-task-detail.component';
import {SelfdataDatasetDetailsComponent} from './pages/selfdata-dataset-details/selfdata-dataset-details.component';
import {SelfdataDatasetsComponent} from './pages/selfdata-datasets/selfdata-datasets.component';
import {
    SelfdataInformationRequestTaskDetailComponent
} from './pages/selfdata-information-request-task-detail/selfdata-information-request-task-detail.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectDetailComponent,
    },
    {
        // Path my-account
        path: 'my-account',
        component: MyAccountComponent,
        canActivate: mapToCanActivate([AuthGuard, UserGuardService])
    },
    {
        path: 'moderation-center',
        component: ModerationCenterComponent,
        canActivate: mapToCanActivate([AuthGuard, ModeratorAdminGuardService])
    },
    {
        // Path my-notifications
        path: 'my-notifications',
        component: MyNotificationsComponent,
        canActivate: mapToCanActivate([AuthGuard, UserGuardService])
    },
    {
        // Path my activity
        path: 'my-activity',
        component: MyActivityComponent,
        canActivate: mapToCanActivate([AuthGuard, UserGuardService])
    },
    {
        // Path to see a reque st detail
        path: 'request-task-detail/:taskId',
        component: DatasetTaskDetailComponent,
        canActivate: mapToCanActivate([AuthGuard, UserGuardService])
    },
    {
        // Path to see the details of a specific project
        path: 'my-project-details/:projectUuid',
        component: MyProjectDetailsComponent,
        canActivate: mapToCanActivate([AuthGuard, UserGuardService, OwnerGuardService])
    },
    {
        // Path to see the details of a specific selfdata
        path: 'selfdata-information-request-task-detail/:taskId',
        component: SelfdataInformationRequestTaskDetailComponent,
        canActivate: mapToCanActivate([AuthGuard, UserGuardService])
    },
    {
        // Path to see my selfdata-dataset last demand
        path: 'selfdata-datasets',
        component: SelfdataDatasetsComponent,
        canActivate: mapToCanActivate([AuthGuard, UserGuardService])
    },
    {
        // Path to see the details of a selfdata dataset
        path: 'selfdata-dataset-details/:datasetUuid',
        component: SelfdataDatasetDetailsComponent,
        canActivate: mapToCanActivate([AuthGuard, UserGuardService])
    },
    {
        // Path to see a new request detail
        path: 'new-request-task-detail/:taskId',
        component: NewRequestTaskDetailComponent,
        canActivate: mapToCanActivate([AuthGuard, UserGuardService])
    },
    {
        // Path to see a project task detail
        path: 'project-task-detail/:taskId',
        component: ProjectTaskDetailComponent,
        canActivate: mapToCanActivate([AuthGuard, UserGuardService])
    },
    {
        // Path to see an organization task detail
        path: 'organization-task-detail/:taskId',
        component: OrganizationTaskDetailComponent,
        canActivate: mapToCanActivate([AuthGuard, UserGuardService])
    },
    {
        // Path to see a producer link task detail
        path: 'linked-producer-task-detail/:taskId',
        component: LinkedProducerTaskDetailComponent,
        canActivate: mapToCanActivate([AuthGuard, UserGuardService])
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)],
    exports: [RouterModule]

})
export class PersonalSpaceRoutingModule {
}
