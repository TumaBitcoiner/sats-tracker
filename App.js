import React from 'react';
import Navigator from './routes/bottomTabNavigatorHome'
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDB, reevaluateAllWalletsBalance } from './database/database';
import { TransactionProvider } from './context/transactionContext';

const initializeAppDB = async () => {
  try {
    await initializeDB();
    console.log('Database initialized');
    await reevaluateAllWalletsBalance();
    console.log('Wallet balances verified');
  } catch (error) {
    console.error('Error during initialization:', error);
  }
};

export default function App() {

  return (
    <SQLiteProvider databaseName='sats-tracker.db' onInit={initializeAppDB}>
      <TransactionProvider>
        <Navigator/>
      </TransactionProvider>
    </SQLiteProvider>
  );
}