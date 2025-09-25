import Navigator from './routes/bottomTabNavigatorHome'
import { StatusBar, StyleSheet } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaProvider>

      <SQLiteProvider databaseName='sats-tracker.db' onInit={initializeAppDB}>
        <TransactionProvider>
          <StatusBar
            translucent={true}
            backgroundColor="transparent"
            barStyle="light-content" // Adjust based on your app's theme
          />
          <Navigator/>
        </TransactionProvider>
      </SQLiteProvider>
    </SafeAreaProvider>

  );
}