import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import { apiService, getQuery } from '../../_services';
import getTableIcons from '../../_helpers/tableIcons';
import getTableLocalization from '../../_helpers/tableLocalization';
import { EditUser } from '../../Dialogs/User';

const useStyles = makeStyles(theme => ({
  mainTable: {
    width: '100%',
    marginRight: '45px',
  },
}));

function UserListComp(props) {
  const classes = useStyles();
  const tableRef = useRef();
  const [workScheduleProfiles, setWorkScheduleProfiles] = useState({});
  const [departments, setDepartments] = useState({});
  const [sections, setSections] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [userId, setUserId] = useState(0);

  useEffect(
    () => {
      apiService.get('work_schedule_profiles?_order[name]=asc')
        .then((result) => {
          const workScheduleProfileList = {};
          result['hydra:member'].forEach((workScheduleProfile) => {
            workScheduleProfileList[`_${workScheduleProfile.id}_`] = workScheduleProfile.name;
          });
          setWorkScheduleProfiles(workScheduleProfileList);
        });

      apiService.get('departments')
        .then((result) => {
          const departmentList = {};
          result['hydra:member'].forEach((department) => {
            departmentList[`_${department.id}_`] = department.name;
          });
          setDepartments(departmentList);
        });

      apiService.get('sections')
        .then((result) => {
          const sectionList = {};
          result['hydra:member'].forEach((section) => {
            sectionList[`_${section.id}_`] = section.name;
          });
          setSections(sectionList);
        });
    },
    [],
  );

  const handleCloseDialog = (reload) => {
    setOpenEditDialog(false);
    setUserId(0);

    if (reload) {
      tableRef.current.onQueryChange();
    }
  };

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
          {
            title: 'Departament',
            field: 'department.name',
            searchField: 'department.id',
            render: rowData => (
              <span>
                {rowData.department && rowData.department.name}
              </span>
            ),
            customFilterAndSearch: () => true,
            lookup: departments,
          },
          {
            title: 'Sekcja',
            field: 'section.name',
            searchField: 'section.id',
            render: rowData => (
              <span>
                {rowData.section && rowData.section.name}
              </span>
            ),
            customFilterAndSearch: () => true,
            lookup: sections,
          },
          {
            title: 'Typ harmonogramu',
            field: 'defaultWorkScheduleProfile.name',
            searchField: 'defaultWorkScheduleProfile.id',
            render: rowData => (
              <span>
                {rowData.defaultWorkScheduleProfile && rowData.defaultWorkScheduleProfile.name}
              </span>
            ),
            customFilterAndSearch: () => true,
            lookup: workScheduleProfiles,
          },
        ]}
        data={query => getQuery(query, 'users')}
        actions={[
          {
            icon: getTableIcons().Edit,
            tooltip: 'Edycja użytkownika',
            onClick: (event, rowData) => {
              setUserId(rowData.id);
              setOpenEditDialog(true);
            },
          },
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
          actionsColumnIndex: -1,
        }}
        localization={getTableLocalization}
      />
      {openEditDialog
      && <EditUser userId={userId} open={openEditDialog} onClose={handleCloseDialog} />}
    </div>
  );
}

const mapStateToProps = (state) => ({});

const connectedUserList = connect(mapStateToProps)(UserListComp);
export { connectedUserList as UserList };
