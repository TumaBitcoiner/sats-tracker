import {FlatList, View, Text, StyleSheet} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { globalStyles } from "../styles/global";
import { CardWallet } from "../cards/cardWallet";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export function WalletChoice({onPress, walletList}) {

    const getWalletType = (type) => {
        return walletList.filter(wallet => wallet.type === type);
    };

    return(
        <View style={globalStyles.container}>
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
                        getWalletType('OC').length === 0 ? (
                            <View style={globalStyles.emptyContainer}>
                                <MaterialIcons name='info' style={globalStyles.emptyIcon} />
                                <Text style={globalStyles.emptyText}>No on-chain wallet recorded. Add one to start adding transactions.</Text>
                            </View>
                        ) : (
                            <FlatList 
                                data={getWalletType('OC')}
                                renderItem={( {item} ) => (
                                    <CardWallet
                                        onPress={() => onPress(item.id, item.type, item.name)}
                                        name={item.name}
                                        type={item.type}                    
                                        balance={item.balance}
                                    />
                                )}
                                keyExtractor={item => item.id.toString()}
                                style={styles.listBackground}
                                contentContainerStyle={styles.listContent}
                            />                                   
                        )
                    )}
                    options={{
                        tabBarIcon: ({ focused }) => (
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
                        getWalletType('LN').length === 0 ? (
                            <View style={globalStyles.emptyContainer}>
                                <MaterialIcons name='info' style={globalStyles.emptyIcon} />
                                <Text style={globalStyles.emptyText}>No lightning wallet recorded. Add one to start adding transactions.</Text>
                            </View>
                        ) : (
                            <FlatList 
                                data={getWalletType('LN')}
                                renderItem={( {item} ) => (
                                    <CardWallet
                                        onPress={() => onPress(item.id, item.type, item.name)}
                                        name={item.name}
                                        type={item.type}                    
                                        balance={item.balance}
                                    />
                                )}
                                keyExtractor={item => item.id.toString()}
                                style={styles.listBackground}
                                contentContainerStyle={styles.listContent}
                            />                              
                        )
                    )}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <MaterialIcons 
                                name="bolt" 
                                size={30} 
                                color={focused ? 'orange' : 'black'}
                            />
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
        
    )
}

const styles = StyleSheet.create({
    listBackground: {
        backgroundColor: '#ffffff', // Match your modal background color
        flex: 1
    },
    listContent: {
        paddingTop: 16
    }
});