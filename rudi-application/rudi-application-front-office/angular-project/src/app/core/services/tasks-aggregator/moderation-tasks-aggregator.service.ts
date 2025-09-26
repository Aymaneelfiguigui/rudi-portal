import {Inject, Injectable, InjectionToken} from '@angular/core';
import {AbstractAggregator} from './abstract-aggregator';
import {Worker} from './worker.interface';

export const WORKERS_MODERATION_TASKS = new InjectionToken<Worker>('moderationTasksWorker');

@Injectable({
    providedIn: 'root'
})
export class ModerationTasksAggregatorService extends AbstractAggregator {

    constructor(@Inject(WORKERS_MODERATION_TASKS) workers: Worker[]) {
        super();
        this.workers = workers;
    }
}
