import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  AppBar,
  Toolbar,
  Avatar,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import {
  fetchBalance,
  deposit as depositApi,
  withdraw as withdrawApi,
  fetchTransactions,
} from "../utils/mockApi";
import TransactionsTable from "./TransactionsTable";
import { Transaction } from "../common/interfaces/transactions.interface";
import DarkModeToggle from "./DarkMofeToggle";

const Dashboard: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBalance().then((data) => {
      setBalance(data);
      setLoading(false);
    });
  }, []);

  // Fetch transactions once when the component mounts
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactions(); // Fetch transactions
        console.log("Fetched transactions:", data); // Debug 
        setTransactions(data); 
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false); 
      }
    };

    loadTransactions(); // Fetch transactions on mount
  }, []); 

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleTransaction = async (type: "deposit" | "withdraw") => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setError("");
    try {
      const updatedBalance =
        type === "deposit"
          ? await depositApi(parsed)
          : await withdrawApi(parsed);
      setBalance(updatedBalance);
      setAmount("");
    } catch (err) {
      if (typeof err === "string") setError(err);
    }
  };

  console.log("Transactions in state:", transactions);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Avatar>A</Avatar>
          <Typography ml={2} variant="h6" sx={{ flexGrow: 1 }}>
            Bank Dashboard
          </Typography>
          <DarkModeToggle />
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <Box mt={6} textAlign="center">
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px", 
              }}
            >
              <Box sx={{ width: 300 }}>
                <Skeleton />
                <Skeleton variant="rectangular" width={300} height={60} />
                <Skeleton animation={false} />
              </Box>
            </Box>
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                Balance: ${balance.toFixed(2)}
              </Typography>

              <Stack spacing={2} mt={4}>
                <TextField
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  fullWidth
                />

                {error && <Typography color="error">{error}</Typography>}

                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleTransaction("deposit")}
                  >
                    Deposit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleTransaction("withdraw")}
                  >
                    Withdraw
                  </Button>
                </Stack>
              </Stack>
            </>
          )}
        </Box>
      </Container>
      <TransactionsTable loading={loading} transactions={transactions} />
    </>
  );
};

export default Dashboard;
