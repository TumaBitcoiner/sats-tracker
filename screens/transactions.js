import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedback, Keyboard} from 'react-native'
import { useNavigation } from "@react-navigation/native";
import Card from '../shared/card'
import { globalStyles } from '../styles/global';
import { categoryArray } from '../styles/categories';
import { MaterialIcons } from '@expo/vector-icons';
import TransactionForm from '../modals/transactionForm';
import ButtonCircular from '../shared/buttonCircular';
import { initializeDB, insertTransaction, getTransactions } from '../database/database'; // Import the createTable function


export default function Transactions(){


    // const dispatch = useDispatch();
    // const transactions = useSelector((state) => state.transactions.transactions);
    // console.log(transactions.length);
    
    
    const [modalOpen, setModalOpen] = useState(false);
    
    const navigation = useNavigation();
    //const [date, setDate] = useState(new Date());
    
    const [transactions, setTransactions] = useState([]);
    
    useEffect(() => {
        const initializeAndFetch = async () => {
            try {
                await initializeDB();
                console.log('Database initialized successfully');
                const fetchedTransactions = await getTransactions();
                
                setTransactions(fetchedTransactions);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        initializeAndFetch();
    }, []);
    
    const handleAddTransaction = async (transaction) => {
        console.log(transaction);
        setModalOpen(false);      
       
        console.log(transaction.date.getDay(), transaction.date.getMonth(), transaction.date.getFullYear());

        try{
            const id = await insertTransaction(transaction); 
            console.log('Transaction added with ID:', id);

            // setTransactions(currentTransactions => [
            //     { ...transaction, id },
            //     ...currentTransactions
            // ]);

            setTransactions(currentTransactions => {
                // Add new transaction
                const newTransactions = [...currentTransactions, { ...transaction, id }];
                
                // Sort by date in descending order (newest first)
                return newTransactions.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA;
                });
            });

        } catch (error) {
            console.error('Error adding transaction:', error);
        }

        //dispatch(saveTransaction(transaction));
        //const transactionKey = useSelector(state => state.transactions);
        
    };

    return(
        <View style={globalStyles.container}>

            <Modal visible={modalOpen} animationType="slide">
               <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={globalStyles.modalOverlay}>  

                            <View style={globalStyles.modalContent}>                        
                                <TransactionForm addNewTransaction={handleAddTransaction}/>
                                <ButtonCircular onPress={() => setModalOpen(false)} icon='close'/>
                            </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <FlatList 
                data={transactions}
                //keyExtractor={(item) => item.id.toString()} // Use the database ID as the key
                renderItem={( {item} ) => (
                    <TouchableOpacity onPress={()=> navigation.navigate('TransactionDetails', item)}>
                        <Card>
                            <View style={globalStyles.transactionCard}>
                                <View style={globalStyles.transactionCard}>
                                    <MaterialIcons 
                                        name={item.isExpenses
                                            ? categoryArray.expenses[item.category][0]
                                            : categoryArray.income[item.category][0]} 
                                        style={globalStyles.icons} />
                                    <Text style={globalStyles.transactionCategoryText}>
                                        {item.isExpenses
                                            ? categoryArray.expenses[item.category][1]
                                            : categoryArray.income[item.category][1]}
                                    </Text>
                                </View>
                                <View style={globalStyles.transactionCard}>
                                    <Text style={item.isExpenses 
                                        ? globalStyles.transactionAmountExpense 
                                        : globalStyles.transactionAmountIncome}>
                                        {item.amount}
                                    </Text>
                                    <Text style={globalStyles.transactionAmount}>{item.transactionType}</Text>
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
                )}
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
    }
})