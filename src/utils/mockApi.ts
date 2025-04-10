import AxiosMockAdapter from "axios-mock-adapter";
import api from "../API";

let mockBalance = 1000;
let transactionId = 1;
const transactions = [
  {
    id: transactionId++,
    type: "deposit",
    amount: 500,
    date: new Date().toISOString(),
  },
];

const mockUser = {
  username: "AM25",
  name: "User",
  email: "user@bankapp.com",
  createdAt: "2024-01-01T00:00:00Z",
};


// create mock data api
const mock = new AxiosMockAdapter(api, { delayResponse: 500 });

mock.onGet("/balance").reply(200, { balance: mockBalance });

mock.onGet("/transactions").reply(200, { transactions });

mock.onPost("/deposit").reply((config) => {
  const { amount } = JSON.parse(config.data);
  if (amount <= 0) return [400, { message: "Invalid amount" }];
  mockBalance += amount;
  transactions.push({
    id: transactionId++,
    type: "deposit",
    amount,
    date: new Date().toISOString(),
  });
  return [200, { balance: mockBalance }];
});

mock.onPost("/withdraw").reply((config) => {
  const { amount } = JSON.parse(config.data);
  if (amount <= 0 || amount > mockBalance)
    return [400, { message: "Insufficient funds" }];
  mockBalance -= amount;
  transactions.push({
    id: transactionId++,
    type: "withdrawal",
    amount,
    date: new Date().toISOString(),
  });
  return [200, { balance: mockBalance }];
});

mock.onGet("/user").reply(200, { user: mockUser });

mock.onGet("/summary").reply(200, {
  totalDeposited: transactions
    .filter((t) => t.type === "deposit")
    .reduce((acc, t) => acc + t.amount, 0),
  totalWithdrawn: transactions
    .filter((t) => t.type === "withdrawal")
    .reduce((acc, t) => acc + t.amount, 0),
  currentBalance: mockBalance,
});

export default mock;
