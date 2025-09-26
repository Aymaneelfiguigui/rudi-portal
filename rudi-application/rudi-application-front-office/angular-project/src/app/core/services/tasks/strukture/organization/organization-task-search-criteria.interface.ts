import {TaskSearchCriteria} from '@core/services/tasks/task-search-criteria.interface';
import {OrganizationStatus} from 'micro_service_modules/strukture/api-strukture';

export interface OrganizationTaskSearchCriteria extends TaskSearchCriteria {
    title?: string;
    organizationStatus?: OrganizationStatus;
    organizationUuid?: string;
}
