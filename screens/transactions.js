import React, {useState} from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native'
import { useNavigation } from "@react-navigation/native";
import Card from '../shared/card'


export default function Transactions(){

    const navigation = useNavigation();

    const [transactions, setTransactions] = useState([
        {amount:'120', category:'Food', note:'lorem ipsum', key:'1'},
    ]);

    return(
        <View>
            <FlatList 
                data={transactions}
                renderItem={( {item} ) => (
                    <TouchableOpacity onPress={()=> navigation.navigate('TransactionDetails', item)}>
                        <Card>
                            <View style={styles.transactionCard}>
                                <Text style={styles.transactionCategory}>{item.category}</Text>
                                <Text style={styles.transactionAmount}>{item.amount}</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                )}
            />
        </View>
    )    
}

const styles = StyleSheet.create({

    transactionCard:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    transactionAmount: {
        fontSize: 20,
    },
    transactionCategory: {
        fontWeight: 'bold',
        fontSize: 20,
    }
});