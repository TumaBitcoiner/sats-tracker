import { useState, useEffect } from 'react';
import {View, Text, FlatList, Dimensions, 
    StyleSheet, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalStyles } from '../styles/global';
import { getCategoryTotalsByWallet, swapTransactions, consolidationTransaction } from '../database/database'; // Import the function to get totals
import { useNavigation } from "@react-navigation/native";
import { CardCategory } from '../cards/cardCategory';
import { PieChart } from 'react-native-chart-kit';
import Card from '../shared/card';
import { EXPENSES_RANK_COLORS } from '../styles/categories';
import HeaderWithOptions from '../headers/headerWithOptions';
import WalletOptions from '../modals/walletOptions';
import SwapFunds from '../modals/walletOptionsActions/swapFunds';
import ConsolidateFunds from '../modals/walletOptionsActions/consolidateFunds';
import WalletForm from '../modals/walletForm'; 
import ConfirmationPopUp from '../modals/confirmationPopUp';
import { MaterialIcons } from '@expo/vector-icons';

export default function WalletDetails({route}){


    const [walletExpenses, setWalletExpenses] = useState([]);
    const [pieData, setPieData] = useState([]);

    const [openWalletOptions, setOpenWalletOptions] = useState(false);
    const [openSwapModal, setOpenSwapModal] = useState(false);
    const [openConsolidationModal, setOpenConsolidationModal] = useState(false);
    const [openEditWalletModal, setOpenEditWalletModal] = useState(false);
    const [openDeleteWalletModal, setOpenDeleteWalletModal] = useState(false);

    //const [walletIncome, setWalletIncome] = useState([]);

    const navigation = useNavigation();
    
    // Transform wallet expenses into pie chart data
    const createPieChartData = (expenses) => {
        return expenses.map(expense => ({
            name: expense.category,
            amount: expense.totalSpent,
            color: EXPENSES_RANK_COLORS[expense.category] || '#808080', // Random color
            legendFontColor: "#7F7F7F",
        }));
    };
    
    const renderItem = ({ item }) => (
        <CardCategory
            item={item}
            onPress={() =>  console.log('Category pressed:', item.category)}
            isExpenses={true}
        />
    );

     const fetchTotalsOfCategoryByWallet = async () => {
            
        try {
                const totals = await getCategoryTotalsByWallet(route.params.id);
                
                setWalletExpenses(totals);
                setPieData(createPieChartData(totals));
               
                console.log("Wallet Expenses:", totals);
            } catch (error) {
                console.error('Error fetching wallet details:', error);
            }
    };

    const manageWallet = (value) => {

        switch(value) {
            case 'swap':
                console.log('Swap');
                setOpenSwapModal(true);
                setOpenWalletOptions(false);
                break;
            case 'consolidate':
                console.log('Consolidate');
                setOpenConsolidationModal(true);
                setOpenWalletOptions(false);
                break;  
            case 'edit':
                console.log('Edit');
                setOpenEditWalletModal(true);
                setOpenWalletOptions(false);
                break;
            case 'delete':
                setOpenDeleteWalletModal(true);
                setOpenWalletOptions(false);
                console.log('Delete');
                break;
            default:
                console.log('Unknown action');
                break;
        }
    }

    useEffect(() => {

        fetchTotalsOfCategoryByWallet();

        const unsubscribe = navigation.addListener('focus', fetchTotalsOfCategoryByWallet);
        
        // Cleanup subscription
        return () => {
            unsubscribe();
        };
    }, [navigation]);

    const handleSwapTransaction = async (values) => {

        console.log('Swap Transaction Values:', values);
        setOpenSwapModal(false);

        try{
            await swapTransactions(values); 
        
            
        } catch (error) {
            console.error('Error adding transaction:', error);
        }

    };

    const handleConsolidateFunds = async (values) => {
        
        setOpenConsolidationModal(false);

        try {
            await consolidationTransaction(values); 
        } catch (error) {
            console.error('Error consolidating funds:', error);
        }
    };

    const handleEditWallet = async (updatedWallet) => {
        
        setOpenEditWalletModal(false);
        console.log('Edit Wallet Values');
        try{
            await route.params.onEdit(route.params.id, updatedWallet);                       
            navigation.goBack();

        } catch (error) {
            console.error('Error editing wallet:', error);
        }
    }
    const handleDeleteWallet = async () => {

        setOpenDeleteWalletModal(false);
        await route.params.onDelete(route.params.id);
        navigation.goBack();   
    }
    
    return(

        <View style={globalStyles.container}>

            {/* Options modal */}
            <Modal visible={openWalletOptions} animationType="none" transparent={true}>
                <TouchableWithoutFeedback onPress={() => setOpenWalletOptions(false)}>
                    <View style={globalStyles.modalOverlay}>  

                            <View style={globalStyles.modalOptionsContent}>                        
                                <WalletOptions onPress={(value) => manageWallet(value)} walletType={route.params.type}/>
                            </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        
            {/* Swap funds modal */}
            <Modal visible={openSwapModal} animationType="slide">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={globalStyles.modalOverlay}>  

                            <View style={globalStyles.modalContent}>                        
                                <SwapFunds swapFunds={handleSwapTransaction} onPress={() => setOpenSwapModal(false)} outWalletId={route.params.id}/>
                            </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>           

            {/* Consolidate funds modal */}
            <Modal visible={openConsolidationModal} animationType="slide">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={globalStyles.modalOverlay}>  

                            <View style={globalStyles.modalContent}>                        
                                <ConsolidateFunds consolidateFunds={handleConsolidateFunds} onPress={() => setOpenConsolidationModal(false)} outWalletId={route.params.id}/>
                            </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>        

            {/* Edit wallet modal */}
            <Modal visible={openEditWalletModal} animationType="slide">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={globalStyles.modalOverlay}>  

                            <View style={globalStyles.modalContent}>                        
                                <WalletForm 
                                    addNewWallet={handleEditWallet} 
                                    onPress={() => setOpenEditWalletModal(false)}
                                    initialValues={{
                                        name: route.params.name,
                                        type: route.params.type,
                                        balance: route.params.balance,
                                        note: '',
                                    }}
                                />
                            </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            {/* Delete wallet modal */}
            <Modal visible={openDeleteWalletModal} animationType="slide">
                <TouchableWithoutFeedback onPress={() => setOpenDeleteWalletModal(false)}>
                    <View style={globalStyles.modalOverlay}>  

                            <View style={globalStyles.modalPopupContent}>                        
                                <ConfirmationPopUp
                                    title='Delete Wallet' 
                                    text='Are you sure you want to delete this wallet? This action cannot be undone.' 
                                    onCancel={() => setOpenDeleteWalletModal(false)}
                                    onConfirm={handleDeleteWallet}
                                />
                            </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <HeaderWithOptions headerTitle='Wallet Details' navigation={navigation} onOptionPress={() => setOpenWalletOptions(true)}/>
            { (walletExpenses.length === 0) ?
                <View style={styles.emptyContainer}>
                    <MaterialIcons name='info' style={styles.emptyIcon} />
                    <Text style={styles.emptyText}>No expenses recorded for this wallet</Text>
                </View>
                :
                <Card>
                    <View style={globalStyles.cardContainer}>
                        <Text style={globalStyles.titleText}>Expenses by Catergory</Text>
                        <PieChart
                            data={pieData}
                            width={Dimensions.get("window").width - 40}
                            height={220}
                            chartConfig={{
                                backgroundColor: "#ffffff",
                                backgroundGradientFrom: "#ffffff",
                                backgroundGradientTo: "#ffffff",
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="amount"
                            backgroundColor="transparent"
                            paddingLeft="15"
                        />
                    </View>
                </Card>
            }
            <View style={styles.listSection}>

                <FlatList 
                    data={walletExpenses}
                    keyExtractor={item => item.category}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerSection: {
        paddingBottom: 10
    },
    listSection: {
        flex: 1
    },
    listContent: {
        paddingBottom: 50
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    emptyIcon: {
        fontSize: 48,
        color: '#666',
        marginBottom: 16
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center'
    }
});