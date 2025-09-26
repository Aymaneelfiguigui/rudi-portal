import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {OrganizationTask, OrganizationTaskDependenciesService, OrganizationTaskDependencyFetchers} from '../../tasks/strukture/organization/organization-task-dependencies.service';
import {OrganizationTaskSearchCriteria} from '../../tasks/strukture/organization/organization-task-search-criteria.interface';
import {OrganizationStatus} from 'micro_service_modules/strukture/api-strukture';
import {WorkerOrganizationService} from '../strukture/organization/worker-organization.service';

@Injectable({
    providedIn: 'root'
})
export class ModerationOrganizationWorkerService extends WorkerOrganizationService {

    constructor(organizationTaskDependenciesService: OrganizationTaskDependenciesService,
                organizationTaskDependencyFetchers: OrganizationTaskDependencyFetchers) {
        super(organizationTaskDependenciesService, organizationTaskDependencyFetchers);
    }

    public override searchTasks(): Observable<OrganizationTask[]> {
        const searchCriteria: OrganizationTaskSearchCriteria = {
            asAdmin: true,
            organizationStatus: OrganizationStatus.Draft
        };
        return this.taskWithDependenciesService.searchTasksWithDependencies(searchCriteria);
    }
}
