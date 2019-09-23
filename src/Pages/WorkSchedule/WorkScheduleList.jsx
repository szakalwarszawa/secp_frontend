
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { apiService, getQuery } from '../../_services';
import getTableIcons from '../../_helpers/tableIcons';
import getTableLocalization from '../../_helpers/tableLocalization';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
    mainTable: {
      width: '100%',
      marginRight: '45px',
    },
  }));

function WorkScheduleListComp(props) {
    const classes = useStyles();
    const tableRef = useRef();
    const [departments, setDepartments] = useState({});
    const [sections, setSections] = useState({});
    const [workScheduleStatuses, setWorkScheduleStatuses] =  useState({});
    const [workScheduleProfiles, setWorkScheduleProfiles] = useState({});

    useEffect(
        () => {
          apiService.get('work_schedule_profiles?_order[name]=asc')
            .then((result) => {
              const workScheduleProfilesList = {};
              result['hydra:member'].forEach((workScheduleProfile) => {
                workScheduleProfilesList[`_${workScheduleProfile.id}_`] = workScheduleProfile.name;
              });
              setWorkScheduleProfiles(workScheduleProfilesList);
            });

          apiService.get('sections?_order[name]=asc')
            .then((result) => {
              const sectionsList = {};
              result['hydra:member'].forEach((section) => {
                sectionsList[`_${section.id}_`] = section.name;
              });
              setSections(sectionsList);
            });

          apiService.get('departments?_order[name]=asc')
            .then((result) => {
              const departmentsList = {};
              result['hydra:member'].forEach((department) => {
                departmentsList[`_${department.id}_`] = department.name;
              });
              setDepartments(departmentsList);
            });

          apiService.get('user_work_schedule_statuses?_order[name]=asc')
            .then((result) => { console.log(result);
              const WorkScheduleStatusesList = {};
              result['hydra:member'].forEach((scheduleStatus) => {
                WorkScheduleStatusesList[`_${scheduleStatus.id}_`] = scheduleStatus.name;
              });
              setWorkScheduleStatuses(WorkScheduleStatusesList);
            });
        },
        [],
      );

    return (
        <div className={classes.mainTable}>
          <MaterialTable
            title={(
              <Typography variant="inherit">
                Lista harmonogramów
              </Typography>
            )}
            tableRef={tableRef}
            icons={getTableIcons()}
            columns={[
                { title: 'Imię', field: 'owner.firstName' },
                { title: 'Nazwisko', field: 'owner.lastName' },
                {
                  title: 'Departament',
                  field: 'owner.department.name',
                  searchField: 'owner.department.id',
                  lookup: departments,
                  render: rowData => (
                    <span>
                      {rowData.owner.department && rowData.owner.department.name}
                    </span>
                  ),
                  customFilterAndSearch: () => true,
                },
                {
                  title: 'Sekcja',
                  field: 'owner.section.name',
                  searchField: 'owner.section.id',
                  lookup: sections,
                  render: rowData => (
                    <span>
                      {rowData.owner.section && rowData.owner.section.name}
                    </span>
                  ),
                  customFilterAndSearch: () => true,
                },
                {
                  title: 'Profil harmonogramu',
                  field: 'workScheduleProfile.name',
                  searchField: 'workScheduleProfile.id',
                  lookup: workScheduleProfiles,
                  render: rowData => (
                    <span>
                      {rowData.workScheduleProfile && rowData.workScheduleProfile.name}
                    </span>
                  ),
                  customFilterAndSearch: () => true,
                },
                {
                  title: 'Od',
                  field: 'fromDate',
                  render: rowData => (
                    <span>
                      { rowData.fromDate && moment(rowData.fromDate).format('YYYY-MM-DD') }
                    </span>
                  )
                },
                {
                  title: 'Do',
                  field: 'toDate',
                  render: rowData => (
                    <span>
                      { rowData.toDate && moment(rowData.toDate).format('YYYY-MM-DD') }
                    </span>
                  )
                },
                {
                  title: 'Status',
                  field: 'status.name',
                  searchField: 'status.id',
                  lookup: workScheduleStatuses,
                  render: rowData => (
                    <span>
                      {rowData.status && rowData.status.name}
                    </span>
                  ),
                  customFilterAndSearch: () => true,
                },
            ]}
            data={query => getQuery(query, 'user_work_schedules')}
            options={{
              search: false,
              filtering: true,
              maxBodyHeight: '500px',
              actionsColumnIndex: -1,
              debounceInterval: 400,
            }}
            localization={getTableLocalization}
          />
        </div>
      );
}

const mapStateToProps = (state) => ({});
const connectedWorkScheduleList = connect(mapStateToProps)(WorkScheduleListComp);
export { connectedWorkScheduleList as WorkScheduleList };
