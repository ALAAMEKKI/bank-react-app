import React, { useEffect, useState, Suspense } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import {
  getBalance,
  deposit,
  withdraw,
  getTransactions,
} from "../services/bankingService";
import DarkModeToggle from "./DarkMofeToggle";

// Lazy loading
const TransactionsTable = React.lazy(() => import("./TransactionsTable"));

const Dashboard: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await getBalance();
        setBalance(balance);

        const transactions = await getTransactions();
        setTransactions(transactions);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        type === "deposit" ? await deposit(parsed) : await withdraw(parsed);

      const updatedTransactions = await getTransactions();

      setBalance(updatedBalance);
      setTransactions(updatedTransactions);
      setAmount("");
      setToastMessage(
        `${type === "deposit" ? "Deposit" : "Withdrawal"} successful!`
      );
      setToastSeverity("success");
      setToastOpen(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Transaction failed");
      setToastMessage("Transaction failed");
      setToastSeverity("error");
      setToastOpen(true);
    }
  };

  // Mui Avatar random name's color
  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Avatar {...stringAvatar("A M")} />
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

      {/* Lazy loading the TransactionsTable component */}
      <Suspense
        fallback={<Skeleton variant="rectangular" width="100%" height={400} />}
      >
        <TransactionsTable loading={loading} transactions={transactions} />
      </Suspense>

      {/* Toast for success or error */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleToastClose}
      >
        <Alert
          onClose={handleToastClose}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard;
