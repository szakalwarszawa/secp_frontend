import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import { apiService, getQuery } from '../../_services';
import getTableIcons from '../../_helpers/tableIcons';
import getTableLocalization from '../../_helpers/tableLocalization';
import { EditUserTimesheet } from '../../Dialogs/UserTimesheet';

const useStyles = makeStyles(theme => ({
  mainTable: {
    width: '100%',
    marginRight: '45px',
  },
}));

function TimesheetListToAcceptComp(prop) {
  const classes = useStyles();
  const tableRef = useRef();
  const [departments, setDepartments] = useState({});
  const [sections, setSections] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [userTimesheetId, setUserTimesheetId] = useState(0);
  const [timesheetStatuses, setTimesheetStatuses] = useState({});

  useEffect(
    () => {
      apiService.get('departments?_order[name]=asc')
        .then((result) => {
          const departmentList = {};
          result['hydra:member'].forEach((department) => {
            departmentList[`_${department.id}_`] = department.name;
          });
          setDepartments(departmentList);
        });

      apiService.get('sections?_order[name]=asc')
        .then((result) => {
          const sectionList = {};
          result['hydra:member'].forEach((section) => {
            sectionList[`_${section.id}_`] = section.name;
          });
          setSections(sectionList);
        });

      apiService.get('user_timesheet_statuses?_order[name]=asc')
        .then((result) => {
          const timesheetStatusesList = {};
          result['hydra:member'].forEach((timesheetStatus) => {
            timesheetStatusesList[`_${timesheetStatus.id}_`] = timesheetStatus.name;
          });
          setTimesheetStatuses(timesheetStatusesList);
        });
    },
    [],
  );

  const handleCloseDialog = (reload) => {
    setOpenEditDialog(false);
    setUserTimesheetId(0);

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
          { title: 'Okres', field: 'period' },
          {
            title: 'Status',
            field: 'status.name',
            searchField: 'status.id',
            lookup: timesheetStatuses,
            render: rowData => (
              <span>
                {rowData.status && rowData.status.name}
              </span>
            ),
            customFilterAndSearch: () => true,
          },
          { title: 'Imię', field: 'owner.firstName' },
          { title: 'Nazwisko', field: 'owner.lastName' },
          {
            title: 'Departament',
            field: 'owner.department.name',
            searchField: 'owner.department.id',
            lookup: departments,
            render: rowData => (
              <span>{rowData.owner.department && rowData.owner.department.name}</span>
            ),
            customFilterAndSearch: () => true,
          },
          {
            title: 'Sekcja',
            field: 'owner.section.name',
            searchField: 'owner.section.id',
            lookup: sections,
            render: rowData => (
              <span>{rowData.owner.section && rowData.owner.section.name}</span>
            ),
            customFilterAndSearch: () => true,
          },
        ]}
        data={query => getQuery(query, 'user_timesheets')}
        actions={[
          {
            icon: getTableIcons().Edit,
            tooltip: 'Edycja listy obecności',
            onClick: (event, rowData) => {
              setUserTimesheetId(rowData.id);
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
        <EditUserTimesheet
          userTimesheetId={userTimesheetId}
          open={openEditDialog}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({});

const connectedTimesheetToAcceptList = connect(mapStateToProps)(TimesheetListToAcceptComp);
export { connectedTimesheetToAcceptList as TimesheetListToAccept };
