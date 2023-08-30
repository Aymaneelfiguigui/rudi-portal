import {OrderValue} from '../../core/services/filters/order-filter';
import {AccessStatusFiltersType} from '../../core/services/filters/access-status-filters-type';

export interface Filters {
    search: string;
    themes: string[];
    keywords: string[];
    producerNames: string[];
    dates: {
        debut: string;
        fin: string;
    };
    order: OrderValue;
    accessStatus: AccessStatusFiltersType;

    /** Global ID du ou des jeux de données */
    globalIds: string[];
    producerUuid: string,
}
