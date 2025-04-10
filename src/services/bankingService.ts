import api from '../API';

export const getBalance = async () => {
  const res = await api.get('/balance');
  return res.data.balance;
};

export const getTransactions = async () => {
  const res = await api.get('/transactions');
  return res.data.transactions;
};

export const deposit = async (amount: number) => {
  const res = await api.post('/deposit', { amount });
  return res.data.balance;
};

export const withdraw = async (amount: number) => {
  const res = await api.post('/withdraw', { amount });
  return res.data.balance;
};

export const getUser = async () => {
  const res = await api.get('/user');
  return res.data.user;
};

export const getSummary = async () => {
  const res = await api.get('/summary');
  return res.data;
};
