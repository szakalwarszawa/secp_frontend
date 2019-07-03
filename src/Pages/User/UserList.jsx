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
import { apiService } from '../../_services';
import { Home } from '../Home';

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.tableRef = React.createRef();
  }

  render() {
    return (
      <div>
        <Home appBarTitle="Lista użytkowników" />
        <div style={{ margin: '20px', marginTop: '90px' }}>
          <MaterialTable
            title="Lista użytkowników"
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
              // { title: 'Id', field: 'id' },
              // { title: 'Username', field: 'username' },
              { title: 'Imię', field: 'firstName' },
              { title: 'Nazwisko', field: 'lastName' },
              { title: 'Email', field: 'email' },
              { title: 'Departament', field: 'department.name', filtering: false },
              { title: 'Sekcja', field: 'section.name', filtering: false },
              {
                title: 'Typ harmonogramu',
                field: 'defaultWorkScheduleProfile.name',
                lookup: {
                  91: 'Domyślny',
                  92: 'Indywidualny',
                  93: 'Ruchomy',
                  94: 'Harmonogram',
                  95: 'Brak',
                },
              },
            ]}
            data={query => new Promise((resolve, reject) => {
              let url = 'users?';
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
                tooltip: 'Odśwież',
                isFreeAction: true,
                icon: Refresh,
                onClick: () => this.tableRef.current && this.tableRef.current.onQueryChange(),
              },
            ]}
            options={{
              search: false,
              filtering: true,
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
export { UserList };
