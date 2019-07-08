import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import { apiService } from '../../_services';
import { getTableIcons } from '../../_helpers/tableIcons';

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.tableRef = React.createRef();
  }

  render() {
    const { classes } = this.props;

    return (
      <MaterialTable
        title="Lista użytkowników"
        tableRef={this.tableRef}
        icons={getTableIcons()}
        columns={[
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
            icon: getTableIcons().Refresh,
            onClick: () => this.tableRef.current && this.tableRef.current.onQueryChange(),
          },
        ]}
        options={{
          search: false,
          filtering: true,
        }}
      />
    );
  }
}

const styles = theme => ({});

UserList.propTypes = {
  classes: PropTypes.instanceOf(Object),
};

UserList.defaultProps = {
  classes: {},
};

function mapStateToProps(state) {
  return {};
}

const styledUserListPage = withStyles(styles)(UserList);
const connectedUserListPage = connect(mapStateToProps)(styledUserListPage);
export { connectedUserListPage as UserList };
