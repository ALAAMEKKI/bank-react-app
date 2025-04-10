import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton } from '@mui/material';
import { deepOrange, green } from '@mui/material/colors';
import { Transaction } from '../common/interfaces/transactions.interface';

const TransactionsTable = ({
  loading,
  transactions,
}: {
  loading: boolean;
  transactions: Transaction[];
}) => {
  if (loading) {
    return (
      <TableContainer sx={{ marginTop:"50px"  }} component={Paper}>
        <Table  sx={{ minWidth: 650 }} aria-label="transactions table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Skeleton  */}
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  <Skeleton width={60} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton width={80} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton width={100} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton width={120} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer  sx={{ marginTop:"50px"  }} component={Paper}>
      <Table sx={{ minWidth: 650,  }}  aria-label="transactions table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction: Transaction) => (
            <TableRow key={transaction.id}>
              <TableCell component="th" scope="row">
                {transaction.id}
              </TableCell>
              <TableCell
                sx={
                  transaction.type === 'withdrawal'
                    ? { color: deepOrange[500] }
                    : { color: green[500] }
                }
                align="right"
              >
                {transaction.type}
              </TableCell>
              <TableCell align="right">${transaction.amount}</TableCell>
              <TableCell align="right">
                {new Date(transaction.date).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionsTable;
