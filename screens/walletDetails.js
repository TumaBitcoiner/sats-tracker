import { useState, useEffect } from 'react';
import {View, Text, StyleSheet,
     Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalStyles } from '../styles/global';
import { getCategoryTotalsByWallet, swapTransactions, consolidationTransaction } from '../database/database'; // Import the function to get totals
import { useNavigation } from "@react-navigation/native";
import HeaderWithOptions from '../headers/headerWithOptions';
import WalletOptions from '../modals/walletOptions';
import SwapFunds from '../modals/walletOptionsActions/swapFunds';
import ConsolidateFunds from '../modals/walletOptionsActions/consolidateFunds';
import WalletForm from '../modals/walletForm'; 
import ConfirmationPopUp from '../modals/confirmationPopUp';
import { MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';
import SubWalletDetails from './sub-screens/subWalletDetails';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createPieChartData } from '../shared/utils';
import { useVisualizationContext } from '../context/visualizationContext'

const Tab = createMaterialTopTabNavigator();


export default function WalletDetails({route}){

    const [walletExpenses, setWalletExpenses] = useState([]);
    const [walletIncome, setWalletIncome] = useState([]);
    const [pieDataExpenses, setPieDataExpenses] = useState([]);
    const [pieDataIncome, setPieDataIncome] = useState([]);

    const { visualization } = useVisualizationContext();

    const [openWalletOptions, setOpenWalletOptions] = useState(false);
    const [openSwapModal, setOpenSwapModal] = useState(false);
    const [openConsolidationModal, setOpenConsolidationModal] = useState(false);
    const [openEditWalletModal, setOpenEditWalletModal] = useState(false);
    const [openDeleteWalletModal, setOpenDeleteWalletModal] = useState(false);

    const navigation = useNavigation();
   
    const fetchTotalsOfCategoryByWallet = async () => {
            
        try {
            const totalsExp = await getCategoryTotalsByWallet(route.params.id, true);
            
            setWalletExpenses(totalsExp);
            console.log('Fetched wallet expenses:', totalsExp);

            setPieDataExpenses(createPieChartData(totalsExp || [], true));

            const totalsInc = await getCategoryTotalsByWallet(route.params.id, false);
            setWalletIncome(totalsInc);

            setPieDataIncome(createPieChartData(totalsInc || [], false));


            console.log('Fetched wallet income:', totalsInc);

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
        //fetchTotalsOfCategoryByWallet();
        const unsubscribe = navigation.addListener('focus', fetchTotalsOfCategoryByWallet);
        return () => unsubscribe();
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
            { (visualization) ? (
                    (walletExpenses.length === 0 && walletIncome.length == 0) ? (
                        <View style={styles.emptyContainer}>
                            <MaterialIcons name='info' style={styles.emptyIcon} />
                            <Text style={styles.emptyText}>No transaction recorded for this wallet</Text>
                        </View>
                        ) : (
                        <Tab.Navigator
                            screenOptions={{
                                tabBarStyle:  globalStyles.tabBarNavigator,
                                tabBarIndicatorStyle: { backgroundColor: '#f7931a' },
                                tabBarLabelStyle: {
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    fontSize: 18
                                },
                            }}
                        >
                            <Tab.Screen 
                                name="Expenses" 
                                children={() => (
                                    walletExpenses.length === 0 ? (
                                        <View style={globalStyles.emptyContainer}>
                                            <MaterialIcons name='info' style={globalStyles.emptyIcon} />
                                            <Text style={globalStyles.emptyText}>No expense transaction added for this wallet.</Text>
                                        </View>
                                    ) : (
                                        <SubWalletDetails isExpense={true} walletTxs={walletExpenses} pieData={pieDataExpenses}/>
                                
                                    )
                                )}
                            />
                            <Tab.Screen 
                                name="Income" 
                                children={() => (
                                    walletIncome.length === 0 ? (
                                        <View style={globalStyles.emptyContainer}>
                                            <MaterialIcons name='info' style={globalStyles.emptyIcon} />
                                            <Text style={globalStyles.emptyText}>No income transaction added for this wallet.</Text>
                                        </View>
                                    ) : (
                                        <SubWalletDetails isExpense={false} walletTxs={walletIncome} pieData={pieDataIncome}/>
                                    
                                    )
                                )}
                            />
                        </Tab.Navigator>
                        )
                ) : (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name='eye-off' style={styles.emptyIcon} />
                        <Text style={styles.emptyText}>Amount Hidden</Text>
                    </View>
                ) 
            }
        </View>
    )
}

const styles = StyleSheet.create({
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