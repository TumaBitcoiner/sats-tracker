import React from 'react';
import { View, FlatList } from 'react-native';
import { CardWallet } from '../cards/cardWallet';
import { globalStyles } from '../styles/global';

export function OCWallets({ wallets, navigation, handleDeleteWallet, handleEditWallet }) {
    return (
        <View style={globalStyles.container}>
            <FlatList
                data={wallets}
                renderItem={({ item }) => (
                    <CardWallet
                        onPress={() => navigation.navigate(
                            'WalletDetails',
                            {  
                                ...item,
                                onDelete: handleDeleteWallet,
                                onEdit: handleEditWallet
                            }
                        )}
                        name={item.name}
                        type={item.type}
                        balance={item.balance}
                    />
                )}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}