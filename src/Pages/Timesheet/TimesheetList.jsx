import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import { apiService, getQuery } from '../../_services';
import getTableIcons from '../../_helpers/tableIcons';
import getTableLocalization from '../../_helpers/tableLocalization';
import { EditUserTimesheetDay } from '../../Dialogs/UserTimesheetDay';

const useStyles = makeStyles(theme => ({
  mainTable: {
    width: '100%',
    marginRight: '45px',
  },
}));

function TimesheetListComp(prop) {
  const classes = useStyles();
  const tableRef = useRef();
  const [presences, setPresences] = useState({});
  const [absences, setAbsences] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [userTimesheetDayId, setUserTimesheetDayId] = useState(0);

  useEffect(
    () => {
      apiService.get('absence_types?_order[name]=asc')
        .then((result) => {
          const absenceList = {};
          result['hydra:member'].forEach((absence) => {
            absenceList[`_${absence.id}_`] = absence.name;
          });
          setAbsences(absenceList);
        });

      apiService.get('presence_types?_order[name]=asc')
        .then((result) => {
          const presenceList = {};
          result['hydra:member'].forEach((presence) => {
            presenceList[`_${presence.id}_`] = presence.name;
          });
          setPresences(presenceList);
        });
    },
    [],
  );

  const handleCloseDialog = (reload) => {
    setOpenEditDialog(false);
    setUserTimesheetDayId(0);

    if (reload) {
      tableRef.current.onQueryChange();
    }
  };


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
          { title: 'Dzień', field: 'userWorkScheduleDay.dayDefinition.id' },
          {
            title: 'Obecność',
            field: 'presenceType.name',
            searchField: 'presenceType.id',
            lookup: presences,
            render: rowData => <span>{rowData.presenceType && rowData.presenceType.name}</span>,
            customFilterAndSearch: () => true,
          },
          {
            title: 'Nieobecność',
            field: 'absenceType.name',
            searchField: 'absenceType.id',
            lookup: absences,
            render: rowData => <span>{rowData.absenceType && rowData.absenceType.name}</span>,
            customFilterAndSearch: () => true,
          },
          { title: 'Rozpoczęcie dnia', field: 'dayStartTime' },
          { title: 'Zakończenie dnia', field: 'dayEndTime' },
          { title: 'Czas pracy', field: 'workingTime', type: 'numeric' },
        ]}
        data={query => getQuery(query, 'user_timesheet_days')}
        actions={[
          {
            icon: getTableIcons().Edit,
            tooltip: 'Edycja dnia pracy',
            onClick: (event, rowData) => {
              setUserTimesheetDayId(rowData.id);
              setOpenEditDialog(true);
            },
          },
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
          filtering: true,
          maxBodyHeight: '500px',
          actionsColumnIndex: -1,
          debounceInterval: 400,
        }}
        localization={getTableLocalization}
      />
      {openEditDialog && (
        <EditUserTimesheetDay
          userTimesheetDayId={userTimesheetDayId}
          open={openEditDialog}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({});

const connectedTimesheetList = connect(mapStateToProps)(TimesheetListComp);
export { connectedTimesheetList as TimesheetList };
