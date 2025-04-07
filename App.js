import React from 'react';
import Navigator from './routes/bottomTabNavigatorHome'
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDB } from './database/database';


export default function App() {

  return (
    <SQLiteProvider databaseName='sats-tracker-2.db' onInit={initializeDB}>

      <Navigator/>
    </SQLiteProvider>
  );
}