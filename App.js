import React from 'react';
import Navigator from './routes/bottomTabNavigatorHome'
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDB } from './database/database';
import { TransactionProvider } from './context/transactionContext';


export default function App() {

  return (
    <SQLiteProvider databaseName='sats-tracker.db' onInit={initializeDB}>
      <TransactionProvider>
        <Navigator/>
      </TransactionProvider>
    </SQLiteProvider>
  );
}