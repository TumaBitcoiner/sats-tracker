import {useState, useEffect} from "react";
import {StyleSheet, View, Text, TouchableWithoutFeedback, Modal, Keyboard} from 'react-native';
import Card from "../shared/card";
import { globalStyles } from "../styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import { categoryArray, walletsArray } from "../styles/categories";
import { getWallets } from "../database/database";
import { useNavigation } from "@react-navigation/native";
import ButtonFlatIcon  from "../shared/buttonFlatIcon";
import ConfirmationPopUp from "../modals/confirmationPopUp";
import TransactionForm from "../modals/transactionForm";
import TransactionOptions from "../modals/transactionOptions";
import HeaderWithOptions from "../headers/headerWithOptions";

export default function TransactionDetails({route}){

    const [wallets, setWallets] = useState([]);
    const navigation = useNavigation();

    const [popupOpen, setPopupOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [openTxOptions, setOpenTxOptions] = useState(false);

    const manageTransaction = (value) => {

        switch(value) {
            case 'edit':
                console.log('Edit');
                setEditOpen(true);
                setOpenTxOptions(false);
                break;
            case 'delete':
                setPopupOpen(true);
                setOpenTxOptions(false);
                console.log('Delete');
                break;
            default:
                console.log('Unknown action');
                break;
        }
    };

    useEffect(() => {
        const fetchWallets = async () => {
            try{
                const fetchedWallets = await getWallets();
                setWallets(fetchedWallets);

            }catch(error){
                console.error('Error fetching wallets:', error);
            }
        };

        fetchWallets();
        // Set up focus listener to refresh transactions when screen is focused
        const unsubscribe = navigation.addListener('focus', () => {
            fetchWallets();
        });

        // Cleanup subscription
        return unsubscribe;
    }, [navigation]);

    const handleDelete = async () => {
        
        console.log("Delete transaction with ID:", route.params.id);
       
        try{
            await route.params.onDelete(route.params.id);                       
            navigation.goBack();

        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const handleEdit = async (updatedTransaction) => {
        
        console.log("Edit transaction with ID:", route.params.id);
       
        try{
            await route.params.onEdit(route.params.id, updatedTransaction);                       
            navigation.goBack();

        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    return (

        <View style={globalStyles.container}>

            {/* Delete transaction confirmation pop-up */}
            <Modal visible={popupOpen} animationType="slide">
               <TouchableWithoutFeedback onPress={() => setPopupOpen(false)}>
                    <View style={globalStyles.modalOverlay}>  

                            <View style={globalStyles.modalPopupContent}>                        
                                <ConfirmationPopUp
                                    title='Delete Transaction' 
                                    text='Are you sure you want to delete this transaction? This action cannot be undone.' 
                                    onCancel={() => setPopupOpen(false)}
                                    onConfirm={handleDelete}
                                />
                            </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Edit transaction form pop-up */}
            <Modal visible={editOpen} animationType="slide">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={globalStyles.modalOverlay}>  

                            <View style={globalStyles.modalContent}>                        
                                <TransactionForm 
                                    addNewTransaction={handleEdit}
                                    onPress={() => setEditOpen(false)}
                                    initialValues={{
                                        amount: route.params.amount,
                                        transactionFee: route.params.transactionFee,
                                        note: route.params.note,
                                        place: route.params.place,
                                        date: new Date(route.params.date),
                                        category: route.params.category,
                                        isExpenses: route.params.isExpenses,
                                        walletId: route.params.walletId,
                                        transactionType: route.params.transactionType
                                    }}
                                />
                            </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Options modal */}
            <Modal visible={openTxOptions} animationType="none" transparent={true}>
                <TouchableWithoutFeedback onPress={() => setOpenTxOptions(false)}>
                    <View style={globalStyles.modalOverlay}>  

                            <View style={globalStyles.modalOptionsContent}>                        
                                <TransactionOptions onPress={(value) => manageTransaction(value)}/>
                            </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <HeaderWithOptions headerTitle='Transaction Details' navigation={navigation} onOptionPress={() => setOpenTxOptions(true)}/>
            <Card>
                <View style={globalStyles.transactionCard}>
                        
                    <View style={styles.category}>
                        <MaterialIcons 
                            name={route.params.isExpenses
                                    ? categoryArray.expenses[route.params.category][0]
                                    : categoryArray.income[route.params.category][0]} 
                            style={globalStyles.icons}
                        />
                        <Text style={{...globalStyles.transactionCategoryText, ...styles.category}}>
                            {route.params.isExpenses
                                ? categoryArray.expenses[route.params.category][1]
                                : categoryArray.income[route.params.category][1]}
                            </Text>
                    </View>
                    <View>
                        <Text 
                            style={route.params.isExpenses 
                                ? globalStyles.transactionAmountExpense 
                                : globalStyles.transactionAmountIncome}
                        >
                            {route.params.amount} sats
                        </Text>
                        <Text style={{...globalStyles.transactionAmountExpense, ...styles.feeText}}>{route.params.transactionFee} sats</Text>
                    </View>
                </View>
                <View style={globalStyles.info}>
                    <MaterialIcons name={walletsArray.type[route.params.transactionType][0]} style={globalStyles.icons} />
                    <Text style={globalStyles.infoText}>{wallets.find(wallet => wallet.id === route.params.walletId)?.name || 'Loading...'}</Text>
                </View>
                <View style={globalStyles.info}>
                    <MaterialIcons name='calendar-month' style={globalStyles.icons} />
                    <Text style={globalStyles.infoText}>{new Date(route.params.date).toLocaleDateString()}</Text>
                </View>
                { (route.params.place === '') ?
                    null :
                    <View style={globalStyles.info}>
                        <MaterialIcons name='place' style={globalStyles.icons} />
                        <Text style={globalStyles.infoText}>{route.params.place}</Text>
                    </View>
                }
                { (route.params.note === '') ?
                    null :
                    <View style={globalStyles.info}>
                        <MaterialIcons name='edit-note' style={globalStyles.icons} />
                        <View style={globalStyles.noteContainer}>
                            <Text style={globalStyles.noteText}>{route.params.note}</Text>
                        </View>
                    </View>
                }
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    
    note: {
        paddingTop: 16,
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
    place:{
        flexDirection: 'row',
        paddingTop: 16,
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    feeText:{
        textAlign: 'right'
    },
    date:{
        flexDirection: 'row',
        paddingTop: 16,
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    category:{
        flexDirection: 'row',
        verticalAlign: 'middle',
    },
});