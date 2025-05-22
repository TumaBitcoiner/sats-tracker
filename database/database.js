import * as SQLite from 'expo-sqlite';
import DatePicker from 'react-native-date-picker';

// Open the database
const db = SQLite.openDatabaseAsync('sats-tracker.db');

export const initializeDB = async () => {

    const database = await db;
    console.log('Creating transactions table...');

    try{
        await  database.execAsync(`
            PRAGMA journal_mode = WAL;
            
            CREATE TABLE IF NOT EXISTS wallets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                balance REAL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATE,
                amount REAL,
                transactionFee REAL,
                category TEXT,
                transactionType TEXT,
                note TEXT,
                place TEXT,
                isExpenses BOOLEAN,
                walletId INTEGER,
                FOREIGN KEY (walletId) REFERENCES wallets(id) ON DELETE CASCADE
            );`);
            
        console.log('Table created successfully!');

    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

 /* =================== Transactions =================== */
 export const insertTransaction = async (transaction) => {
     
    const database = await db;
    console.log('Adding transaction...');

    const sqliteDate = transaction.date.toISOString().split('T')[0];

    try {

        const result = await database.runAsync(
            `INSERT INTO transactions (date, amount, transactionFee, category, transactionType, note, place, isExpenses, walletId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
                sqliteDate,
                transaction.amount,
                transaction.transactionFee,
                transaction.category,
                transaction.transactionType,
                transaction.note,
                transaction.place,
                transaction.isExpenses,
                transaction.walletId
            ]
        );

        // Update wallet balance
        await updateWalletBalance(
            transaction.walletId, 
            transaction.amount, 
            transaction.isExpenses
        );

        console.log(result.lastInsertRowId, result.changes);
        return result.lastInsertRowId;

    } catch (error){
        console.error('Error inserting new transaction in database:', error);
        throw error;
    }


};

// Retrieve all transactions from the database
export const getTransaction = async (id) => {

    const database = await db;
    console.log('Fetching transaction with id:', id);

    try {
        const result = await database.getAllAsync('SELECT * FROM transactions WHERE id = ?;',
            [id]
        );
        
        if (result.length === 0) {
            return null; // Return null if no transaction found
        }

        // Convert SQLite date string to Date object and return the first (and only) result
        return {
            ...result[0],
            date: new Date(result[0].date + 'T00:00:00')
        };

    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

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

// Get total income of trnasactions from the database
export const getTotalIncome = async () => {
    const database = await db;
    console.log('Calculating total income...');

    try {
        const result = await database.getAllAsync(
            `SELECT SUM(amount) as total 
             FROM transactions 
             WHERE isExpenses = false;`
        );
        
        return result[0]?.total || 0;
    } catch (error) {
        console.error('Error calculating total income:', error);
        throw error;
    }
};

export const getTotalExpenses = async () => {
    const database = await db;
    console.log('Calculating total expenses...');

    try {
        const result = await database.getAllAsync(
            `SELECT SUM(amount) as total 
             FROM transactions 
             WHERE isExpenses = true;`
        );
        
        return result[0]?.total || 0;
    } catch (error) {
        console.error('Error calculating total expenses:', error);
        throw error;
    }
};

export const getTotalFees = async () => {
    const database = await db;
    console.log('Calculating total fees...');

    try {
        const result = await database.getAllAsync(
            `SELECT SUM(transactionFee) as total 
             FROM transactions`
        );
        
        return result[0]?.total || 0;
    } catch (error) {
        console.error('Error calculating total fees:', error);
        throw error;
    }
};

// Delete a transaction by ID
export const deleteTransaction = async (id) => {

    const database = await db;
    console.log('Deleting transaction...');

    try {

        transaction = await getTransaction(id);
        console.log('Transaction FOUND:', transaction);
        if (transaction){

            const result = await database.runAsync(
                `DELETE FROM transactions WHERE id = ?;`,
                [id]
            );
        }
        else {
            console.log('Transaction not found');
            return;
        }

        // Update wallet balance
        await updateWalletBalance(
            transaction.walletId, 
            transaction.amount, 
            !transaction.isExpenses
        );

    } catch (error){
        console.error('Error deleting a transaction in database:', error);
        throw error;
    }
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
/* ==================================================== */

 /* =================== Wallets =================== */

 // Create a new wallet
export const createWallet = async (wallet) => {
    const database = await db;
    
    try {
        const result = await database.runAsync(
            `INSERT INTO wallets (name, type, balance) VALUES (?, ?, ?);`,
            [wallet.name, wallet.type, wallet.balance]
        );
        const sqliteDate = new Date().toISOString().split('T')[0];
        
        await database.runAsync(
            `INSERT INTO transactions (
                date, 
                amount, 
                transactionFee, 
                category, 
                transactionType, 
                note, 
                place, 
                isExpenses,
                walletId
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
                sqliteDate,
                wallet.balance,
                0, // No transaction fee for initial balance
                'Initial Balance', // Special category
                wallet.type,
                'Initial balance.',
                '',
                false, // Not an expense
                result.lastInsertRowId
            ]
        );
        return result.lastInsertRowId;
        
    } catch (error) {
        console.error('Error creating wallet:', error);
        throw error;
    }

};

// Update wallet balance
export const updateWalletBalance = async (walletId, amount, isExpense) => {
    const database = await db;
    
    try {
        await database.runAsync(
            `UPDATE wallets 
             SET balance = balance + ? 
             WHERE id = ?;`,
            [isExpense ? -amount : amount, walletId]
        );
    } catch (error) {
        console.error('Error updating wallet balance:', error);
        throw error;
    }
};

// Get all wallets
export const getWallets = async () => {
    const database = await db;
    
    try {
        return await database.getAllAsync(`SELECT * FROM wallets;`);
    } catch (error) {
        console.error('Error fetching wallets:', error);
        throw error;
    }
};

export const getLNWallets = async () => {
    const database = await db;
    
    try {
        return await database.getAllAsync(`SELECT * FROM wallets WHERE type = 'LN';`);
    } catch (error) {
        console.error('Error fetching wallets:', error);
        throw error;
    }
};

export const getOCWallets = async () => {
    const database = await db;
    
    try {
        return await database.getAllAsync(`SELECT * FROM wallets WHERE type = 'OC';`);
    } catch (error) {
        console.error('Error fetching wallets:', error);
        throw error;
    }
};

 /* =============================================== */
