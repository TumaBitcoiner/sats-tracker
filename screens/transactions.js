import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Text, Modal,
     TouchableWithoutFeedback, Keyboard, SectionList} from 'react-native'
import { useNavigation } from "@react-navigation/native";
import Card from '../shared/card'
import { globalStyles } from '../styles/global';
import { categoryArray, walletsArray } from '../styles/categories';
import { MaterialIcons } from '@expo/vector-icons';
import TransactionForm from '../modals/transactionForm';
import ButtonCircular from '../shared/buttonCircular';
import { initializeDB, insertTransaction, getTransactions, deleteTransaction, editTransaction } from '../database/database'; // Import the createTable function
import { useTransactions } from '../context/transactionContext';
import { CardTransaction } from '../cards/cardTransaction';
import { groupTransactionsByDate } from '../shared/utils';


export default function Transactions(){

    const { updateTotals } = useTransactions();
  
    const [modalOpen, setModalOpen] = useState(false);
    
    const navigation = useNavigation();
    //const [date, setDate] = useState(new Date());
    
    const [transactions, setTransactions] = useState([]);

    // Function to fetch transactions
    const fetchTransactions = async () => {
        try {
            const fetchedTransactions = await getTransactions();
            setTransactions(fetchedTransactions);
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
            updateTotals();
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
                                <TransactionForm addNewTransaction={handleAddTransaction} onPress={() => setModalOpen(false)}/>
                            </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            
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