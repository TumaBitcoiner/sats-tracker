import React, {useEffect, useState} from 'react'
import { View, Text, TouchableWithoutFeedback, Modal, Keyboard, FlatList } from 'react-native'
import ButtonCircular from '../shared/buttonCircular';
import WalletForm from '../modals/walletForm';
import { globalStyles } from '../styles/global';
import Card from '../shared/card';
import { initializeDB, getLNWallets, getOCWallets, createWallet } from '../database/database'; // Import the createTable function
import { CardWallet } from '../cards/cardWallet';



export default function Wallets(){

    const [modalOpen, setModalOpen] = useState(false);

    const [walletsOC, setWalletsOC] = useState([]);
    const [walletsLN, setWalletsLN] = useState([]);

    useEffect(() => {
            const initializeAndFetch = async () => {
                try {
                    await initializeDB();
                    console.log('Database initialized successfully');

                    const fetchedLNWallets = await getLNWallets();
                    setWalletsLN(fetchedLNWallets);

                    const fetchedOCWallets = await getOCWallets();
                    setWalletsOC(fetchedOCWallets);
                    
                } catch (error) {
                    console.error('Error:', error);
                }
            };
    
            initializeAndFetch();
    }, []);

    const handleAddWallet = async (wallet) => {
        console.log(wallet);
        setModalOpen(false);      
       
        try{
            const id = await createWallet(wallet); 
            console.log('Adding new wallet with ID:', id);
            console.log('Wallet type:', wallet.type);

            if (wallet.type === 'LN') {
                
                setWalletsLN(currentWallets => {
                    const newWallet = [currentWallets, { ...wallet, id }];
                })
            }
            else if (wallet.type === 'OC') {

                setWalletsOC(currentWallets => {
                    const newWallet = [currentWallets, { ...wallet, id }];
                })
            }

            // Refetch all wallets to ensure sync
            const [newLNWallets, newOCWallets] = await Promise.all([
                getLNWallets(),
                getOCWallets()
            ]);
            
            setWalletsLN(newLNWallets);
            setWalletsOC(newOCWallets);
                
            //await updateTotals();

        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    return(
        <View style={globalStyles.container}>
           
            <Modal visible={modalOpen} animationType="slide">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={globalStyles.modalOverlay}>  

                            <View style={globalStyles.modalContent}>                        
                                <WalletForm addNewWallet={handleAddWallet}/>
                                <ButtonCircular onPress={() => setModalOpen(false)} icon='close'/>
                            </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <View>
                <Card>
                    <View>
                        <Text> OC Wallets</Text>
                        <FlatList 
                            data={walletsOC}
                            contentContainerStyle={globalStyles.listContainer} 
                            renderItem={( {item} ) => (
                                <CardWallet
                                    onPress={() => console.log('BRAVO')}
                                    name={item.name}
                                    type={item.type}
                                />
                            )}
                        />
                    </View>
                </Card>
            </View>

            <View>
                <Card>
                    <View>
                        <Text> LN Wallets</Text>
                        <FlatList 
                            data={walletsLN}
                            contentContainerStyle={globalStyles.listContainer} 
                            renderItem={( {item} ) => (
                                <CardWallet
                                    onPress={() => console.log('BRAVO')}
                                    name={item.name}
                                    type={item.type}
                                />
                            )}
                        />
                    </View>
                </Card>
            </View>

            <ButtonCircular onPress={() => setModalOpen(true)} icon='add'/>
        </View>
    )    
}