import React, { useRef } from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import { getQuery } from '../../_services';
import getTableIcons from '../../_helpers/tableIcons';

const useStyles = makeStyles(theme => ({
  mainTable: {
    width: '100%',
    marginRight: '45px',
  },
}));

function UserListComp(props) {
  const classes = useStyles();
  const tableRef = useRef();

  return (
    <div className={classes.mainTable}>
      <MaterialTable
        title={(
          <Typography variant="inherit">
            Lista użytkowników
          </Typography>
        )}
        tableRef={tableRef}
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
        data={query => getQuery(query, 'users')}
        actions={[
          {
            tooltip: 'Odśwież',
            isFreeAction: true,
            icon: getTableIcons().Refresh,
            onClick: () => tableRef.current && tableRef.current.onQueryChange(),
          },
        ]}
        options={{
          search: false,
          filtering: true,
          maxBodyHeight: '500px',
        }}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {};
}

const connectedUserList = connect(mapStateToProps)(UserListComp);
export { connectedUserList as UserList };
