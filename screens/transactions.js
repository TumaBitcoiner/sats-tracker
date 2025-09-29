import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Text, Modal,
     TouchableWithoutFeedback, Keyboard, SectionList} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from '../styles/global';
import TransactionForm from '../modals/transactionForm';
import ButtonCircular from '../shared/buttonCircular';
import { initializeDB, insertTransaction, getTransactions, deleteTransaction, editTransaction } from '../database/database'; // Import the createTable function
import { useTransactions } from '../context/transactionContext';
import { CardTransaction } from '../cards/cardTransaction';
import { groupTransactionsByDate } from '../shared/utils';
import Header from '../headers/header';


export default function Transactions(){

    const { updateTotals } = useTransactions();
  
    const [modalOpen, setModalOpen] = useState(false);
    
    const navigation = useNavigation();
    //const [date, setDate] = useState(new Date());
    
    const [transactions, setTransactions] = useState([]);
    const [lastTransaction, setLastTransaction] = useState(null);

    // Function to fetch transactions
    const fetchTransactions = async () => {
        try {
            const fetchedTransactions = await getTransactions();
            setTransactions(fetchedTransactions);

            // Set last transaction (most recent) or null if no transactions
            const lastTx = fetchedTransactions.length > 0 
                ? fetchedTransactions[0]  // Assuming transactions are ordered by date desc
                : null;
            setLastTransaction(lastTx);

            console.log('Last Tx:', lastTx);
        
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };
    
    useEffect(() => {
        const initializeAndFetch = async () => {
            try {
                await initializeDB();
                console.log('Database initialized successfully');
                await fetchTransactions();
              
            } catch (error) {
                console.error('Error:', error);
            }
        };

        initializeAndFetch();
        // Set up focus listener to refresh transactions when screen is focused
        const unsubscribe = navigation.addListener('focus', () => {
            fetchTransactions();
            //updateTotals();
        });

        // Cleanup subscription
        return unsubscribe;
    }, [navigation]);
    
    const handleAddTransaction = async (transaction) => {
        console.log(transaction);
        setModalOpen(false);      
       
        console.log(transaction.date.getDay(), transaction.date.getMonth(), transaction.date.getFullYear());

        try{
            const id = await insertTransaction(transaction); 
            console.log('Transaction added with ID:', id);

            setTransactions(currentTransactions => {
                // Add new transaction
                const newTransactions = [...currentTransactions, { ...transaction, id }];
                
                return newTransactions;
            });
            setLastTransaction(transaction);
            await updateTotals();
            
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };
    
    const handleDeleteTransaction = async (id) => {
        try {
            await deleteTransaction(id);
            // Update local state by filtering out the deleted transaction
            setTransactions(currentTransactions => 
                currentTransactions.filter(transaction => transaction.id !== id)
            );
            await updateTotals();
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const handleEditTransaction = async (id, updatedTransaction) => {
        try {
            console.log('Editing transaction with ID:', id);
            console.log('Updated transaction:', updatedTransaction);
            await editTransaction(id, updatedTransaction);

            // Update local state by filtering out the deleted transaction
            setTransactions(currentTransactions => 
                currentTransactions.map(transaction => 
                    transaction.id === id ? {...transaction, ...updatedTransaction} : transaction
                )
            );
            await updateTotals();
        } catch (error) {
            console.error('Error Editing transaction:', error);
        }
    };
    
    const renderSectionHeader = ({section}) => (
        <View style={globalStyles.sectionHeader}>
            <Text style={globalStyles.sectionHeaderText}>
                {new Date(section.date).toLocaleDateString()}
            </Text>
        </View>
    );
    

    return(
        <View style={globalStyles.container}>

            <Modal visible={modalOpen} animationType="slide">
               <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={globalStyles.modalOverlay}>  

                            <View style={globalStyles.modalContent}>                        
                                { lastTransaction === null ?
                                    <TransactionForm 
                                        addNewTransaction={handleAddTransaction} 
                                        onPress={() => setModalOpen(false)}
                                    />
                                    :
                                    <TransactionForm 
                                        addNewTransaction={handleAddTransaction} 
                                        onPress={() => setModalOpen(false)}
                                        initialValues={{
                                            amount: 0,
                                            transactionFee: 0,
                                            note: '',
                                            place: '',
                                            date: new Date(lastTransaction.date),
                                            category: lastTransaction.category,
                                            isExpenses: lastTransaction.isExpenses,
                                            walletId: lastTransaction.walletId,
                                            transactionType: lastTransaction.transactionType
                                        }}
                                    />
                                }
                            </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            
            <Header title='Transactions'/>
            {(transactions.length === 0) ?
                <View style={globalStyles.emptyContainer}>
                        <MaterialIcons name='info' style={globalStyles.emptyIcon} />
                        <Text style={globalStyles.emptyText}>No transactions recorded.</Text>
                </View>
                :
                <SectionList 
                    sections={groupTransactionsByDate(transactions)}
                    contentContainerStyle={globalStyles.listContainer}
                    renderItem={({ item }) => (
                        <CardTransaction
                            item={item}
                            onPress={() => navigation.navigate(
                                'TransactionDetails',
                                {  
                                    ...item,
                                    onDelete: handleDeleteTransaction,
                                    onEdit: handleEditTransaction
                                }
                            )}
                        />
                    )}
                    renderSectionHeader={renderSectionHeader}
                />
            }
            <ButtonCircular onPress={() => setModalOpen(true)} icon='add'/>
        </View>
    )    
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    date:{
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    
})