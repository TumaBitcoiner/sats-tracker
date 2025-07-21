import * as SQLite from 'expo-sqlite';
import DatePicker from 'react-native-date-picker';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { date } from 'yup';

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
            transaction.transactionFee,
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

// Retrieve all transactions by wallet ID
export const getTransactionsByWallet = async (walletId) => {

    const database = await db;
    console.log('Fetching transactions...');

    try {
        const result = await database.getAllAsync(`SELECT id FROM transactions WHERE walletId = ?;`, [walletId]);
        
        return result;

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

// Get total amounts from a certain month
export const getMonthlyTotals = async (month, year) => {
    const database = await db;
    console.log('Fetching totals for:', month, year);

    try {
        // Get start and end dates for the specified month
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

        console.log('Date range:', startDate, 'to', endDate);


        const result = await database.getAllAsync(`
            SELECT 
                SUM(CASE WHEN isExpenses = 0 THEN amount ELSE 0 END) as totalIncome,
                SUM(CASE WHEN isExpenses = 1 THEN amount ELSE 0 END) as totalExpenses,
                SUM(transactionFee) as totalFees
            FROM transactions 
            WHERE date BETWEEN ? AND ?;`,
            [startDate, endDate]
        );

        console.log('Monthly totals result:', result);
        return {
            totalIncome: result[0].totalIncome || 0,
            totalExpenses: result[0].totalExpenses || 0,
            totalFees: result[0].totalFees || 0
        };

    } catch (error) {
        console.error('Error fetching monthly totals:', error);
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
            -transaction.transactionFee,
            !transaction.isExpenses
        );

    } catch (error){
        console.error('Error deleting a transaction in database:', error);
        throw error;
    }
};

// Delete all transactions by wallet ID
export const deleteTransactionByWallet = async (walletId) => {

    const database = await db;
    console.log('Deleting transaction...');

    try {

        await database.runAsync(
            `DELETE FROM transactions WHERE walletId = ?;`,
            [walletId]
        );
        
    } catch (error){
        console.error('Error deleting a transaction in database:', error);
        throw error;
    }
};

// Update a transaction by ID
export const editTransaction = async (id, updatedTransaction) => {
   
    const database = await db;
    console.log('Editing transaction...');

    try {
        
        // Delete tx amount from wallet balance.
        oldTransaction = await getTransaction(id);

        await updateWalletBalance(
            oldTransaction.walletId, 
            oldTransaction.amount, 
            -oldTransaction.transactionFee,
            !oldTransaction.isExpenses
        );

        const sqliteDate = updatedTransaction.date.toISOString().split('T')[0];

        // Update the tx in the db
        await database.runAsync(
            `UPDATE transactions SET date = ?, amount = ?, transactionFee = ?, category = ?, transactionType = ?, note = ?, place = ?, isExpenses = ?, walletId = ?  WHERE id = ?;`,
            [
                sqliteDate,
                updatedTransaction.amount,
                updatedTransaction.transactionFee,
                updatedTransaction.category,
                updatedTransaction.transactionType,
                updatedTransaction.note,
                updatedTransaction.place,
                updatedTransaction.isExpenses,
                updatedTransaction.walletId,
                id
            ]
        ); 

        await updateWalletBalance(
            updatedTransaction.walletId, 
            updatedTransaction.amount, 
            updatedTransaction.transactionFee,
            updatedTransaction.isExpenses
        );
    } catch (error) {
        console.error('Error editing transaction:', error);
        throw error;
    }
};

export const swapTransactions = async (values) => {

    const outTransaction = {
        date: values.date,
        amount: values.amount,
        transactionFee: values.transactionFee,
        category: values.categoryOut,
        transactionType: values.transactionTypeOut,
        note: values.note,
        place: values.place,
        isExpenses: values.isExpensesOut,
        walletId: values.walletIdOut
    }

    console.log('Out Transaction:', outTransaction);

    await insertTransaction(outTransaction);

    const inTransaction = {
        date: values.date,
        amount: values.amount,
        transactionFee: 0,
        category: values.categoryIn,
        transactionType: values.transactionTypeIn,
        note: values.note,
        place: values.place,
        isExpenses: values.isExpensesIn,
        walletId: values.walletIdIn
    }

    console.log('In Transaction:', inTransaction);

    await insertTransaction(inTransaction);
    
}

export const consolidationTransaction = async (transaction) => {

    console.log('Consolidation Transaction:', transaction);
    
    await insertTransaction(transaction);
}
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

// Edit a wallet
export const editWallet = async (id, updatedWallet) => {

    const database = await db;
    console.log('Editing wallet...');

    
    
    try { 
        await database.runAsync(
            `UPDATE wallets 
            SET name = ?, type = ? 
            WHERE id = ?;`,
            [
                updatedWallet.name,
                updatedWallet.type,  
                id
            ]
        );
    } catch (error) {
        console.error('Error editing wallet:', error);
        throw error;
    }
    
    const oldBalance = await getWalletBalance(id);
    const walletDiff = updatedWallet.balance - oldBalance;

    adjustmentTransaction = {
        date: new Date(),
        amount: Math.abs(walletDiff),
        transactionFee: 0,
        category: 'Adjust Balance',
        transactionType: updatedWallet.type,
        note: 'Adjusting wallet balance.',
        place: '',
        isExpenses: (walletDiff < 0) ? true : false,
        walletId: id
    }
    
    console.log('Adjustment Transaction:', adjustmentTransaction);
    await insertTransaction(adjustmentTransaction);
};

// Delete a wallet
export const deleteWallet = async (id) => {

    const database = await db;
    console.log('Deleting wallet with ID:', id);

    const result = await getTransactionsByWallet(id);
    console.log('Transactions to delete:', result);
    
    await deleteTransactionByWallet(id);

    try {
        await database.runAsync(
            `DELETE FROM wallets WHERE id = ?;`,
            [id]
        );
        console.log('Wallet deleted successfully');
    } catch (error) {
        console.error('Error deleting wallet:', error);
        throw error;
    }
};

// Update wallet balance
export const updateWalletBalance = async (walletId, amount, fee, isExpense) => {
    const database = await db;
    
    try {
        await database.runAsync(
            `UPDATE wallets 
             SET balance = balance + ? - ?
             WHERE id = ?;`,
            [isExpense ? -amount : amount, fee, walletId]
        );
    } catch (error) {
        console.error('Error updating wallet balance:', error);
        throw error;
    }
};

// At startup, check all wallets and update their balances
export const reevaluateAllWalletsBalance = async () => {

    const database = await db;
    console.log('Reevaluating all wallet balances...');

    try {
        // First, set all wallet balances to 0
        await database.runAsync('UPDATE wallets SET balance = 0;');

        // Get all transactions ordered by date
        const transactions = await database.getAllAsync(`
            SELECT walletId, amount, transactionFee, isExpenses 
            FROM transactions 
            ORDER BY date ASC;
        `);

        // Process each transaction and update wallet balances
        for (const transaction of transactions) {
            await updateWalletBalance(
                transaction.walletId,
                transaction.amount,
                transaction.transactionFee,
                transaction.isExpenses
            );
        }

        console.log('Wallet balances reevaluated successfully');
    } catch (error) {
        console.error('Error reevaluating wallet balances:', error);
        throw error;
    }
}

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

export const getWallet = async (id) => {
    const database = await db;
    
    try {
        const result =  await database.getAllAsync(`
            SELECT * FROM wallets
            WHERE id = ?;`,
            [id]);
        console.log('Wallet fetched:', result);
        return result;
    } catch (error) {
        console.error('Error fetching wallet:', error);
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

export const getLNBalance = async () => {
    const database = await db;
    
    try {
        const result = await database.getAllAsync(`SELECT SUM(balance) as total FROM wallets WHERE type = 'LN';`);
        return result[0]?.total || 0;
    } catch (error) {
        console.error('Error fetching LN wallets balance:', error);
        throw error;
    }
};

export const getOCBalance = async () => {
    const database = await db;
    
    try {
        const result = await database.getAllAsync(`SELECT SUM(balance) as total FROM wallets WHERE type = 'OC';`);
        return result[0]?.total || 0;
    } catch (error) {
        console.error('Error fetching OC wallets balance:', error);
        throw error;
    }
}

export const getWalletBalance = async (id) => {
    const database = await db;  
    try {
        const result = await database.getAllAsync(`SELECT balance FROM wallets WHERE id = ?;`, [id]);
        return result[0]?.balance || 0;
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        throw error;
    }
}

export const getCategoryTotalsByWallet = async (walletId) => {
    const database = await db;
    try {
        const result = await database.getAllAsync(
            `SELECT category, SUM(amount) as totalSpent
             FROM transactions
             WHERE walletId = ? AND isExpenses = 1 AND category NOT IN ('Swap Out', 'Consolidation', 'Adjust Balance')
             GROUP BY category
             ORDER BY totalSpent DESC;`,
            [walletId]
        );
        // Returns an array: [{ category: 'Food', totalSpent: 1234 }, ...]
        return result;
    } catch (error) {
        console.error('Error fetching category totals by wallet:', error);
        throw error;
    }
};
 /* =============================================== */
