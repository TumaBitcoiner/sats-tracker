import * as SQLite from 'expo-sqlite';

// Open the database
const db = SQLite.openDatabaseAsync('transactions.db');

export const initializeDB = async () => {

    const database = await db;
    console.log('Creating transactions table...');

    try{
        await  database.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT,
                amount REAL,
                transactionFee REAL,
                category TEXT,
                transactionType TEXT,
                note TEXT,
                place TEXT
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

    try {

        const result = await database.runAsync(
            `INSERT INTO transactions (date, amount, transactionFee, category, transactionType, note, place) VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [
                transaction.date,
                transaction.amount,
                transaction.transactionFee,
                transaction.category,
                transaction.transactionType,
                transaction.note,
                transaction.place,
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
        const result = await database.getAllAsync('SELECT * FROM transactions;');
        return result;
        // for (const row of result) {
        //     console.log(row.id, row.amount);
        // }
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