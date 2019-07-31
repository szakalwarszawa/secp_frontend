import React, { useRef } from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import { getQuery } from '../../_services';
import getTableIcons from '../../_helpers/tableIcons';
import getTableLocalization from '../../_helpers/tableLocalization';

const useStyles = makeStyles(theme => ({
  mainTable: {
    width: '100%',
    marginRight: '45px',
  },
}));

function TimesheetListComp(prop) {
  const classes = useStyles();
  const tableRef = useRef();

  return (
    <div className={classes.mainTable}>
      <MaterialTable
        title={(
          <Typography variant="inherit">
            Listy obecności
          </Typography>
        )}
        tableRef={tableRef}
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
        data={query => getQuery(query, 'user_timesheet_days')}
        actions={[
          {
            disabled: false,
            icon: getTableIcons().Refresh,
            isFreeAction: true,
            tooltip: 'Refresh Data',
            onClick: () => tableRef.current && tableRef.current.onQueryChange(),
          },
        ]}
        options={{
          search: false,
          maxBodyHeight: '500px',
        }}
        localization={getTableLocalization}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {};
}

const connectedTimesheetList = connect(mapStateToProps)(TimesheetListComp);
export { connectedTimesheetList as TimesheetList };
