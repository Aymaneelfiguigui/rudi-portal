import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ProjectTask, ProjectTaskDependenciesService, ProjectTaskDependencyFetcher} from '../../tasks/projekt/project-task-dependencies.service';
import {ProjektTaskSearchCriteria} from '../../tasks/projekt/projekt-task-search-criteria.interface';
import {WorkerProjectService} from '../projekt/worker-project.service';

@Injectable({
    providedIn: 'root'
})
export class ModerationProjectWorkerService extends WorkerProjectService {

    constructor(projectTaskDependenciesService: ProjectTaskDependenciesService,
                projectTaskDependencyFetcher: ProjectTaskDependencyFetcher) {
        super(projectTaskDependenciesService, projectTaskDependencyFetcher);
    }

    public override searchTasks(): Observable<ProjectTask[]> {
        const searchCriteria: ProjektTaskSearchCriteria = {
            asAdmin: true
        };
        return this.taskWithDependenciesService.searchTasksWithDependencies(searchCriteria);
    }
}
