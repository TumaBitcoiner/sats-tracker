import * as SQLite from 'expo-sqlite';
import DatePicker from 'react-native-date-picker';

// Open the database
const db = SQLite.openDatabaseAsync('sats-tracker-9.db');

export const initializeDB = async () => {

    const database = await db;
    console.log('Creating transactions table...');

    try{
        await  database.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATE,
                amount REAL,
                transactionFee REAL,
                category TEXT,
                transactionType TEXT,
                note TEXT,
                place TEXT,
                isExpenses BOOLEAN
            );`);
            
        console.log('Table created successfully!');

    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

export const insertTransaction = async (transaction) => {
    
    const database = await db;
    console.log('Adding transaction...');

    const sqliteDate = transaction.date.toISOString().split('T')[0];

    try {

        const result = await database.runAsync(
            `INSERT INTO transactions (date, amount, transactionFee, category, transactionType, note, place, isExpenses) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [
                sqliteDate,
                transaction.amount,
                transaction.transactionFee,
                transaction.category,
                transaction.transactionType,
                transaction.note,
                transaction.place,
                transaction.isExpenses,
            ]
        );

        console.log(result.lastInsertRowId, result.changes);
        return result.lastInsertRowId;

    } catch (error){
        console.error('Error inserting new transaction in database:', error);
        throw error;
    }


}

// Retrieve all transactions from the database
export const getTransactions = async () => {

    const database = await db;
    console.log('Fetching transactions...');

    try {
        const result = await database.getAllAsync('SELECT * FROM transactions ORDER BY date DESC, id DESC;');
        
        return result.map(row => ({
            ...row,
            date: new Date(row.date + 'T00:00:00') // Convert SQLite date string to Date object
        }));

    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

// Delete a transaction by ID
export const deleteTransaction = (id) => {
    return dbPromise.then(db => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM transactions WHERE id = ?;`,
                    [id],
                    () => {
                        console.log(`Transaction with ID ${id} deleted successfully`);
                        resolve();
                    },
                    (error) => {
                        console.error('Error deleting transaction:', error);
                        reject(error);
                    }
                );
            });
        });
    });
};

// Update a transaction by ID
export const updateTransaction = (id, updatedTransaction) => {
    return dbPromise.then(db => {
        return new Promise((resolve, reject) => {
            db.runAsync(
                    `UPDATE transactions SET date = ?, amount = ?, category = ?, transactionType = ?, transactionFee = ?, note = ?, place = ? WHERE id = ?;`,
                    [
                        updatedTransaction.date,
                        updatedTransaction.amount,
                        updatedTransaction.category,
                        updatedTransaction.transactionType,
                        updatedTransaction.transactionFee,
                        updatedTransaction.note,
                        updatedTransaction.place,
                        id,
                    ],
                    () => {
                        console.log(`Transaction with ID ${id} updated successfully`);
                        resolve();
                    },
                    (error) => {
                        console.error('Error updating transaction:', error);
                        reject(error);
                    }
                );
            });
        });

};