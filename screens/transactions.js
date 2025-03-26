import React, {useState} from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native'
import { useNavigation } from "@react-navigation/native";
import Card from '../shared/card'
import { globalStyles } from '../styles/global';
import { categoryIcons } from '../styles/categories';
import { MaterialIcons } from '@expo/vector-icons';


export default function Transactions(){

    const navigation = useNavigation();
    //const [date, setDate] = useState({day: '25', month: '03', year:'2025'});
    
    const [transactions, setTransactions] = useState([
        {date: { day: '24', month: '03', year: '2025' }, amount:'120', category:'Groceries', transactionType: 'LN', transactionFee: '1', note:'Spesa mensile cibo', place:'Esselunga', key:'1'},
        {date: { day: '24', month: '03', year: '2025' }, amount:'16000', category:'Transportation', transactionType: 'OC', transactionFee: '152', note:'Macchina nuova', place:'Car Shop', key:'2'},
    ]);
    
    
    return(
        <View>
            <FlatList 
                data={transactions}
                renderItem={( {item} ) => (
                    <TouchableOpacity onPress={()=> navigation.navigate('TransactionDetails', item)}>
                        <Card>
                            <View style={globalStyles.transactionCard}>
                                <View style={globalStyles.transactionCard}>
                                    <MaterialIcons name={categoryIcons.categories[item.category]} style={globalStyles.icons} />
                                    <Text style={globalStyles.transactionCategoryText}>{item.category}</Text>
                                </View>
                                <View style={globalStyles.transactionCard}>
                                    <Text style={globalStyles.transactionAmount}>{item.amount}</Text>
                                    <Text style={globalStyles.transactionAmount}>{item.transactionType}</Text>
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
                )}
            />
        </View>
    )    
}

const styles = StyleSheet.create({
    date:{
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    }
})