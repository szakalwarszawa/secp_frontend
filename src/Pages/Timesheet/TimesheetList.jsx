import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import SaveAlt from '@material-ui/icons/SaveAlt';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Add from '@material-ui/icons/Add';
import Check from '@material-ui/icons/Check';
import FilterList from '@material-ui/icons/FilterList';
import Remove from '@material-ui/icons/Remove';
import Clear from '@material-ui/icons/Clear';
import Refresh from '@material-ui/icons/Refresh';
import Edit from '@material-ui/icons/Edit';
import SortArrow from '@material-ui/icons/ArrowUpward';
import Delete from '@material-ui/icons/DeleteOutline';
import { Home } from '../Home';
import { apiService } from '../../_services';
import { IconProps } from '@material-ui/core/Icon';

class TimesheetList extends React.Component {
  constructor(props) {
    super(props);

    this.tableRef = React.createRef();
  }

  render() {
    return (
      <div>
        <Home appBarTitle="Lista obecności" />
        <div style={{ margin: '20px', marginTop: '90px' }}>
          <MaterialTable
            title="Listy obecności"
            tableRef={this.tableRef}
            icons={{
              Add,
              Check,
              Clear,
              Delete,
              DetailPanel: ChevronRight,
              Edit,
              Export: SaveAlt,
              Filter: FilterList,
              FirstPage,
              LastPage,
              NextPage: ChevronRight,
              PreviousPage: ChevronLeft,
              ResetSearch: Clear,
              Search,
              SortArrow,
              ThirdStateCheck: Remove,
              ViewColumn,
              Refresh,
            }}
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
                icon: Refresh,
                isFreeAction: true,
                tooltip: 'Refresh Data',
                onClick: () => this.tableRef.current && this.tableRef.current.onQueryChange(),
              },
            ]}
            options={{
              search: false,
            }}
          />
        </div>
      </div>
    );
  }
}

// const styles = theme => ({});
//
// TimesheetList.propTypes = {
//   classes: PropTypes.instanceOf(Object),
// };
//
// TimesheetList.defaultProps = {
//   classes: {},
// };
//
// function mapStateToProps(state) {
//   return {};
// }

// const styledTimesheetListPage = withStyles(styles)(TimesheetList);
// const connectedTimesheetListPage = connect(mapStateToProps)(styledTimesheetListPage);
export { TimesheetList };
