let mockBalance = 1000; // Simulated starting balance

interface Transaction {
    id: number;
    type: 'deposit' | 'withdrawal';
    amount: number;
    date: string;
  }
const transactions: { id: number; type: 'deposit' | 'withdrawal'; amount: number; date: string }[] = []; // Track transactions
let transactionId = 1; // Transaction ID counter

export const fetchBalance = (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBalance);
    }, 500); // Simulate delay
  });
};

export const fetchTransactions = (): Promise<Transaction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(transactions); // Return all transactions
      }, 1000); // Simulate delay
    });
  };


  export const deposit = (amount: number): Promise<number> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (amount <= 0) {
          reject('Invalid amount');
        } else {
          mockBalance += amount;
          // Add transaction to the history
          transactions.push({
            id: transactionId++,
            type: 'deposit',
            amount,
            date: new Date().toISOString(),
          });
          resolve(mockBalance);
        }

      }, 500);
      console.log(transactions,"t");
      
    });
  };

  export const withdraw = (amount: number): Promise<number> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (amount <= 0 || amount > mockBalance) {
          reject('Invalid or insufficient amount');
        } else {
          mockBalance -= amount;
          // Add transaction to the history
          transactions.push({
            id: transactionId++,
            type: 'withdrawal',
            amount,
            date: new Date().toISOString(),
          });
          resolve(mockBalance);
        }
      }, 500);
    });
  };
