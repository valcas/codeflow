import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontFamily : '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 16
    },
    body: {
    },
}))(TableCell);
  
export default class EventTable extends Component   {

    render()    {

        const { classes } = this.props;

        return (
        <Table>
            <TableHead>
              <TableRow style={{height: '30px'}}>
                <CustomTableCell>Request</CustomTableCell>
                <CustomTableCell numeric>Process</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.data.map((cell, index) => {
                var rowClass = (index == this.props.activegraph.graph.selectedresponse) ? 'selected-row' : '';
                return (
                  <TableRow className={rowClass} key={index} onClick={() => {this.props.rowClickHandler(index)}}  style={{height: '30px'}}>
                    <CustomTableCell component="th" scope="row">
                      {index}
                    </CustomTableCell>
                    <CustomTableCell numeric>{cell.processid}</CustomTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
        </Table>
        )
    }
}