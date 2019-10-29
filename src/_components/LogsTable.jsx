import React, { useState, useEffect } from 'react';
import {
  Card, Table, TableHead, TableRow, TableCell, TableBody,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import moment from 'moment';
import { apiService } from '../_services';

function LogsTableComp(props) {
  const {
    route,
    value,
  } = props;
  const [logs, setLogs] = useState([]);

  useEffect(
    () => {
      apiService.get(`${route}/${value}/logs`)
        .then((result) => {
          setLogs(result['hydra:member']);
        });
    },
    [value, route],
  );

  return (
    <Card>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Utworzony przez</TableCell>
            <TableCell>Zdarzenie</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                {moment(row.logDate).format('YYYY-MM-DD')}
              </TableCell>
              <TableCell>
                { row.owner.firstName }
                {' '}
                { row.owner.lastName }
              </TableCell>
              <TableCell>
                { row.notice }
              </TableCell>
            </TableRow>
          ))}
          { !logs.length && (
            <TableRow key={0}>
              <TableCell colSpan={2}>
                Rejestr zmian jest pusty.
              </TableCell>
            </TableRow>
          ) }
        </TableBody>
      </Table>
    </Card>
  );
}

LogsTableComp.propTypes = {
  route: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export { LogsTableComp as LogsTable };
