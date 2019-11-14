import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';

import { Typography } from '@material-ui/core';
import { ContentDialog } from '../Common';
import getTableIcons from '../../_helpers/tableIcons';
import getTableLocalization from '../../_helpers/tableLocalization';
import { apiService, getQuery } from '../../_services';
import { history } from '../../_helpers';

function ChooseUser(props) {
  const {
    open,
    targetUrl,
    onClose,
    onSelectUser,
  } = props;

  const tableRef = useRef();
  const [departments, setDepartments] = useState({});
  const [sections, setSections] = useState({});

  useEffect(
    () => {
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

  const closeDialogHandler = () => onClose(false);

  const saveDialogHandler = (userId) => {
    onSelectUser(userId);
    history.push(`/${targetUrl}/${userId}`);
  };

  return (
    <ContentDialog
      open={open}
      onAccept={saveDialogHandler}
      onDecline={closeDialogHandler}
      acceptLabel="Otwórz"
      declineLabel="Anuluj"
      dialogTitle="Wybierz pracownika"
    >
      <div>
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
            {
              title: 'Departament',
              field: 'department.name',
              searchField: 'department.id',
              render: (rowData) => (
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
              render: (rowData) => (
                <span>
                  {rowData.section && rowData.section.name}
                </span>
              ),
              customFilterAndSearch: () => true,
              lookup: sections,
            },
          ]}
          data={(query) => getQuery(query, 'users')}
          actions={[
            {
              icon: getTableIcons().Filter,
              tooltip: 'Wybierz użytkownika',
              onClick: (event, rowData) => {
                saveDialogHandler(rowData.id);
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
      </div>
    </ContentDialog>
  );
}

const styles = (theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  formControl: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(),
  },
  progressBarWrapper: {
    margin: 0,
    position: 'relative',
  },
  errorBox: {
    padding: theme.spacing(),
    marginTop: theme.spacing(),
    background: theme.palette.error.main,
  },
});

ChooseUser.propTypes = {
  open: PropTypes.bool.isRequired,
  targetUrl: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectUser: PropTypes.func.isRequired,
};

ChooseUser.defaultProps = {
};

const mapStateToProps = (state) => ({});

const styledChooseUser = withStyles(styles)(ChooseUser);
const connectedChooseUser = connect(mapStateToProps)(styledChooseUser);
export { connectedChooseUser as ChooseUser };
