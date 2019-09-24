import { apiService } from './api.service';

const getQuery = (query, endpoint) => new Promise((resolve, reject) => {
  let url = `${endpoint}?`;
  url += `itemsPerPage=${query.pageSize || 5}`;
  url += `&page=${(query.page || 0) + 1}`;

  if (query.orderBy && query.orderBy.field) {
    url += `&_order[${query.orderBy.sortField || query.orderBy.field}]=${query.orderDirection}`;
  }

  if (query.filters && query.filters.length > 0) {
    query.filters.forEach((filter) => {
      if (filter.value !== null && typeof filter.value.forEach === 'function') {
        filter.value.forEach((value) => {
          url += `&${filter.column.searchField || filter.column.field}[]=${value.replace(/_/gi, '')}`;
        });
      } else {
        url += `&${filter.column.searchField || filter.column.field}[]=${filter.value.replace(/_/gi, '')}`;
      }
    });
  }

  apiService.get(url)
    .then((result) => {
      resolve({
        data: result['hydra:member'],
        page: query.page || 0,
        totalCount: result['hydra:totalItems'],
      });
    });
});

export { getQuery };
