import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import { apiService } from '../../_services';
import { getTableIcons } from '../../_helpers/tableIcons';

class TimesheetList extends React.Component {
  constructor(props) {
    super(props);

    this.tableRef = React.createRef();
  }

  render() {
    const { classes } = this.props;

    return (
      <MaterialTable
        title="Listy obecności"
        tableRef={this.tableRef}
        icons={getTableIcons()}
        columns={[
          { title: 'Okres', field: 'userTimesheet.period' },
          { title: 'Imię', field: 'userTimesheet.owner.firstName' },
          { title: 'Nazwisko', field: 'userTimesheet.owner.lastName' },
          { title: 'Obecność', field: 'presenceType.name' },
          { title: 'Nieobecność', field: 'absenceType.name' },
          { title: 'Rozpoczęcie dnia', field: 'dayStartTime' },
          { title: 'Zakończenie dnia', field: 'dayEndTime' },
          { title: 'Czas pracy', field: 'workingTime' },
        ]}
        data={query => new Promise((resolve, reject) => {
          let url = 'user_timesheet_days?';
          url += `itemsPerPage=${query.pageSize}`;
          url += `&page=${query.page + 1}`;

          if (query.orderBy && query.orderBy.field) {
            url += `&_order[${query.orderBy.field}]=${query.orderDirection}`;
          }

          if (!!query.filters && query.filters.length > 0) {
            query.filters.forEach((filter) => {
              url += `&${filter.column.field}[]=${filter.value}`;
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
        })
        }
        actions={[
          {
            disabled: false,
            icon: getTableIcons().Refresh,
            isFreeAction: true,
            tooltip: 'Refresh Data',
            onClick: () => this.tableRef.current && this.tableRef.current.onQueryChange(),
          },
        ]}
        options={{
          search: false,
        }}
      />
    );
  }
}

const styles = theme => ({});

TimesheetList.propTypes = {
  classes: PropTypes.instanceOf(Object),
};

TimesheetList.defaultProps = {
  classes: {},
};

function mapStateToProps(state) {
  return {};
}

//
const styledTimesheetListPage = withStyles(styles)(TimesheetList);
const connectedTimesheetListPage = connect(mapStateToProps)(styledTimesheetListPage);
export { connectedTimesheetListPage as TimesheetList };
