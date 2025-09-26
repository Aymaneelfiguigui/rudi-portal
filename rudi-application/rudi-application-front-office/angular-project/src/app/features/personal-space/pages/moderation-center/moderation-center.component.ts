import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {Subscription, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ProcessDefinitionEnum} from '@core/services/tasks/process-definition.enum';
import {ModerationTasksAggregatorService} from '@core/services/tasks-aggregator/moderation-tasks-aggregator.service';
import {RequestToStudy} from '@core/services/tasks-aggregator/request-to-study.interface';
import {SnackBarService} from '@core/services/snack-bar.service';
import {TranslateService} from '@ngx-translate/core';
import {Level} from '@shared/notification-template/notification-template.component';

interface ModerationFilter {
    type: ModerationTaskType | 'ALL';
    status: string | 'ALL';
    search: string;
}

export enum ModerationTaskType {
    PROJECT = 'PROJECT',
    ORGANIZATION = 'ORGANIZATION'
}

const MODERATOR_ACTION_NAMES = ['validated', 'refused', 'ok'];

@Component({
    selector: 'app-moderation-center',
    templateUrl: './moderation-center.component.html',
    styleUrls: ['./moderation-center.component.scss']
})
export class ModerationCenterComponent implements OnInit, OnDestroy {

    displayedColumns: string[] = ['type', 'description', 'initiator', 'receivedDate', 'status', 'actions'];
    dataSource = new MatTableDataSource<RequestToStudy>([]);

    loading = false;
    private subscription = new Subscription();
    private allRequests: RequestToStudy[] = [];

    countsByType: Record<ModerationTaskType, number> = {
        [ModerationTaskType.PROJECT]: 0,
        [ModerationTaskType.ORGANIZATION]: 0
    };
    totalRequests = 0;

    statuses: string[] = [];

    filters: ModerationFilter = {
        type: 'ALL',
        status: 'ALL',
        search: ''
    };

    readonly ModerationTaskType = ModerationTaskType;

    constructor(private readonly moderationTasksAggregatorService: ModerationTasksAggregatorService,
                private readonly router: Router,
                private readonly translateService: TranslateService,
                private readonly snackBarService: SnackBarService) {
    }

    ngOnInit(): void {
        this.fetchTasks();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    fetchTasks(): void {
        this.loading = true;
        const load$ = this.moderationTasksAggregatorService.loadTasks()
            .pipe(
                catchError(err => {
                    console.error('Failed to load moderation tasks', err);
                    this.snackBarService.openSnackBar({
                        level: Level.ERROR,
                        message: this.translateService.instant('personalSpace.moderationCenter.errorLoading')
                    });
                    return of([] as RequestToStudy[]);
                })
            )
            .subscribe(requests => {
                this.loading = false;
                this.populateData(requests ?? []);
            });
        this.subscription.add(load$);
    }

    refresh(): void {
        this.fetchTasks();
    }

    clearSearch(): void {
        this.filters.search = '';
        this.applyFilters();
    }

    applyFilters(): void {
        const filtered = this.allRequests.filter(request => this.matchFilters(request));
        this.dataSource.data = filtered.sort((a, b) => this.compareDatesDesc(a.receivedDate, b.receivedDate));
    }

    private populateData(requests: RequestToStudy[]): void {
        const moderatorRequests = (requests ?? []).filter(request => this.hasModeratorActions(request));

        this.allRequests = moderatorRequests;
        this.totalRequests = this.allRequests.length;
        this.countsByType[ModerationTaskType.PROJECT] = this.allRequests.filter(r => this.getTaskType(r) === ModerationTaskType.PROJECT).length;
        this.countsByType[ModerationTaskType.ORGANIZATION] = this.allRequests.filter(r => this.getTaskType(r) === ModerationTaskType.ORGANIZATION).length;
        this.statuses = Array.from(new Set(this.allRequests.map(request => request.status).filter(status => !!status)));
        this.applyFilters();
    }

    private matchFilters(request: RequestToStudy): boolean {
        const type = this.getTaskType(request);
        if (this.filters.type !== 'ALL' && type !== this.filters.type) {
            return false;
        }
        if (this.filters.status !== 'ALL' && request.status !== this.filters.status) {
            return false;
        }
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            const fields = [request.description, request.initiator, request.status]
                .filter(Boolean)
                .map(value => value.toLowerCase());
            if (!fields.some(field => field.includes(searchTerm))) {
                return false;
            }
        }
        return true;
    }

    private compareDatesDesc(a: Date, b: Date): number {
        const dateA = a ? new Date(a).getTime() : 0;
        const dateB = b ? new Date(b).getTime() : 0;
        return dateB - dateA;
    }

    getTaskType(request: RequestToStudy): ModerationTaskType {
        switch (request.processDefinitionKey) {
            case ProcessDefinitionEnum.PROJECT_PROCESS:
                return ModerationTaskType.PROJECT;
            case ProcessDefinitionEnum.ORGANIZATION_PROCESS:
                return ModerationTaskType.ORGANIZATION;
            default:
                return ModerationTaskType.PROJECT;
        }
    }

    private hasModeratorActions(request: RequestToStudy): boolean {
        const actions = request.actions ?? [];
        return actions.some(action => MODERATOR_ACTION_NAMES.includes((action.name || '').toLowerCase()));
    }

    getTypeLabel(type: ModerationTaskType): string {
        if (type === ModerationTaskType.PROJECT) {
            return this.translateService.instant('personalSpace.moderationCenter.typeProject');
        }
        return this.translateService.instant('personalSpace.moderationCenter.typeOrganization');
    }

    openTask(request: RequestToStudy): Promise<boolean> {
        if (!request?.url) {
            return Promise.resolve(false);
        }
        return this.router.navigate(['/personal-space', request.url, request.taskId]);
    }

    trackByTaskId(_index: number, request: RequestToStudy): string {
        return request.taskId;
    }
}
