import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import { Typography, LinearProgress } from '@material-ui/core';

import { apiService, getQuery } from '../../_services';
import getTableIcons from '../../_helpers/tableIcons';
import getTableLocalization from '../../_helpers/tableLocalization';
import { EditUserTimesheetDay } from '../UserTimesheetDay';

const useStyles = makeStyles(theme => ({
  mainTable: {
    width: '100%',
    marginRight: '45px',
  },
}));

function UserTimesheetDayTableComp(props) {
  const {
    userTimesheetId,
  } = props;

  const classes = useStyles();
  const tableRef = useRef();
  const [presences, setPresences] = useState({});
  const [absences, setAbsences] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [userTimesheetDayId, setUserTimesheetDayId] = useState(0);
  const [userTimesheetData, setUserTimesheetData] = useState({
    userTimesheet: {
      owner: {
        lastName: '',
        firstName: '',
      },
    },
    userWorkScheduleDay: {
      dayDefinition: {},
    },
    presenceType: {
      id: -1,
    },
    absenceType: {},
  });
  const [state, setState] = useState({
    loaded: false,
    loaderWorkerCount: 0,
  });
  const isLoading = Boolean(state.loaderWorkerCount > 0);

  useEffect(
    () => {
      setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1 }));
      apiService.get('absence_types?_order[name]=asc')
        .then((result) => {
          const absenceList = {};
          result['hydra:member'].forEach((absence) => {
            absenceList[`_${absence.id}_`] = absence.name;
          });
          setAbsences(absenceList);
          setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
        });

      setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1 }));
      apiService.get('presence_types?_order[name]=asc')
        .then((result) => {
          const presenceList = {};
          result['hydra:member'].forEach((presence) => {
            presenceList[`_${presence.id}_`] = presence.name;
          });
          setPresences(presenceList);
          setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
        });

      setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1 }));
      apiService.get(`user_timesheets/${userTimesheetId}`)
        .then((result) => {
          setUserTimesheetData(s => ({
            ...s,
            ...result,
          }));
          setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
          setState(s => ({ ...s, loaded: true }));
        });
    },
    [userTimesheetId],
  );

  const queryForData = (query) => {
    query.filters.push({
      value: `_${userTimesheetId}_`,
      column: {
        searchField: 'userTimesheet.id',
      },
    });
    return getQuery(query, 'user_timesheet_days');
  };

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
        title={state.loaded
          ? (
            <Typography variant="inherit">
              {`${userTimesheetData.period} - ${userTimesheetData.owner.lastName} ${userTimesheetData.owner.firstName}`}
            </Typography>
          )
          : ''}
        tableRef={tableRef}
        icons={getTableIcons()}
        columns={[
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
        data={queryForData}
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
      <div className={classes.progressBarWrapper}>
        {isLoading && <LinearProgress />}
      </div>
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

UserTimesheetDayTableComp.propTypes = {
  userTimesheetId: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({ ...state });

const connectedUserTimesheetDayTable = connect(mapStateToProps)(UserTimesheetDayTableComp);
export { connectedUserTimesheetDayTable as UserTimesheetDayTable };
