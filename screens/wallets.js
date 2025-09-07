import {useEffect, useState} from 'react'
import { View, Text, TouchableWithoutFeedback,
     Modal, Keyboard, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import ButtonCircular from '../shared/buttonCircular';
import WalletForm from '../modals/walletForm';
import { globalStyles } from '../styles/global';
import { initializeDB, getLNWallets, getOCWallets, createWallet, editWallet, deleteWallet } from '../database/database'; // Import the createTable function
import { useTransactions } from '../context/transactionContext';
import { LNWallets } from './LNWallets';
import { OCWallets } from './OCWallets';

const Tab = createMaterialTopTabNavigator();


export default function Wallets(){

    const { updateTotals } = useTransactions();

    const [modalOpen, setModalOpen] = useState(false);

    const [walletsOC, setWalletsOC] = useState([]);
    const [walletsLN, setWalletsLN] = useState([]);

    const navigation = useNavigation();

    const fetchWalletsLN = async () => {

        try{
            const fetchedLNWallets = await getLNWallets();
            setWalletsLN(fetchedLNWallets);

        }catch(error){
            console.error('Error fetching wallets:', error);
        }

    }

    const fetchWalletsOC = async () => {

        try{
            const fetchedOCWallets = await getOCWallets();
            setWalletsOC(fetchedOCWallets);

        }catch(error){
            console.error('Error fetching wallets:', error);
        }

    }

    useEffect(() => {
            const initializeAndFetch = async () => {
                try {
                    await initializeDB();
                    console.log('Database initialized successfully');
                    
                    fetchWalletsLN();
                    
                    fetchWalletsOC();
                    
                } catch (error) {
                    console.error('Error:', error);
                }
            };
    
            initializeAndFetch();
            
            const unsubscribe = navigation.addListener('focus', () => {
                fetchWalletsLN();                    
                fetchWalletsOC();
            });
    
            // Cleanup subscription
            return unsubscribe;
        }, [navigation]);

    const handleAddWallet = async (wallet) => {
        console.log(wallet);
        setModalOpen(false);      
       
        try{
            const id = await createWallet(wallet); 
            console.log('Adding new wallet with ID:', id);
            console.log('Wallet type:', wallet.type);

            
            if (wallet.type === 'LN') {
                
                setWalletsLN(currentWallets => [...currentWallets, { ...wallet, id }]);
            }
            else if (wallet.type === 'OC') {

                setWalletsOC(currentWallets => [...currentWallets, { ...wallet, id }]);
            }

            // Refetch all wallets to ensure sync
            const [newLNWallets, newOCWallets] = await Promise.all([
                getLNWallets(),
                getOCWallets()
            ]);
            
            setWalletsLN(newLNWallets);
            setWalletsOC(newOCWallets);
                
            await updateTotals();

        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const handleEditWallet = async (id, updatedWallet) => {
        console.log(updatedWallet);
        await editWallet(id, updatedWallet);       
    }

    const handleDeleteWallet = async (id) => {
       
        await deleteWallet(id);
        // Update the state to remove the deleted wallet
        setWalletsOC(currentWallets => currentWallets.filter(wallet => wallet.id !== id));
        setWalletsLN(currentWallets => currentWallets.filter(wallet => wallet.id !== id));
    }

    return(
        <View style={globalStyles.container}>
           
            <Modal visible={modalOpen} animationType="slide">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={globalStyles.modalOverlay}>  

                            <View style={globalStyles.modalContent}>                        
                                <WalletForm addNewWallet={handleAddWallet} onPress={() => setModalOpen(false)}/>
                            </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {(walletsOC.length === 0 && walletsLN.length === 0) ?
                <View style={globalStyles.emptyContainer}>
                    <MaterialIcons name='info' style={globalStyles.emptyIcon} />
                    <Text style={globalStyles.emptyText}>No wallet recorded. Add one to start adding transactions.</Text>
                </View>
                :
                <Tab.Navigator
                    screenOptions={{
                        tabBarStyle: { backgroundColor: '#fff' },
                        tabBarIndicatorStyle: { backgroundColor: 'orange' },
                        tabBarShowIcon: true,
                        tabBarShowLabel: false
                    }}
                    >
                    <Tab.Screen 
                        name="OC" 
                        children={() => (
                            walletsOC.length === 0 ? (
                                <View style={globalStyles.emptyContainer}>
                                    <MaterialIcons name='info' style={globalStyles.emptyIcon} />
                                    <Text style={globalStyles.emptyText}>No on-chain wallet recorded. Add one to start adding transactions.</Text>
                                </View>
                            ) : (
                                <OCWallets 
                                    wallets={walletsOC}
                                    navigation={navigation}
                                    handleDeleteWallet={handleDeleteWallet}
                                    handleEditWallet={handleEditWallet}
                                />                                
                            )
                        )}
                        options={{
                            tabBarIcon: ({ focused, color }) => (
                                <MaterialIcons 
                                    name="currency-bitcoin" 
                                    size={30} 
                                    color={focused ? 'orange' : 'black'}
                                />
                            )
                         }}
                    />
                    <Tab.Screen 
                        name="LN" 
                        children={() => (
                            walletsLN.length === 0 ? (
                                <View style={globalStyles.emptyContainer}>
                                    <MaterialIcons name='info' style={globalStyles.emptyIcon} />
                                    <Text style={globalStyles.emptyText}>No lightning wallet recorded. Add one to start adding transactions.</Text>
                                </View>
                            ) : (
                                <LNWallets 
                                    wallets={walletsLN}
                                    navigation={navigation}
                                    handleDeleteWallet={handleDeleteWallet}
                                    handleEditWallet={handleEditWallet}
                                />                                
                            )
                        )}
                        options={{
                            tabBarIcon: ({ focused, color }) => (
                                <MaterialIcons 
                                    name="bolt" 
                                    size={30} 
                                    color={focused ? 'orange' : 'black'}
                                />
                            ),
                            tabBarLabel: '' // Remove text if you want only icons
                         }}
                    />
                </Tab.Navigator>
            }
            <ButtonCircular onPress={() => setModalOpen(true)} icon='add'/>
        </View>
    )    
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        width: '100%'
    }
});