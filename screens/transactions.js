import React, {useState} from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedback, Keyboard} from 'react-native'
import { useNavigation } from "@react-navigation/native";
import Card from '../shared/card'
import { globalStyles } from '../styles/global';
import { categories, categoryIcons } from '../styles/categories';
import { MaterialIcons } from '@expo/vector-icons';
import TransactionForm from '../modals/transactionForm';
import ButtonCircular from '../shared/buttonCircular';
import DatePicker from 'react-native-date-picker';


export default function Transactions(){

    const [modalOpen, setModalOpen] = useState(false);

    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    
    const [transactions, setTransactions] = useState([
        {date: date.toLocaleDateString(), amount:'120', category: categories.expenses[1], transactionType: 'LN', transactionFee: '1', note:'Spesa mensile cibo', place:'Esselunga', key:'1'},
        {date: date.toLocaleDateString(), amount:'16000', category: categories.expenses[2], transactionType: 'OC', transactionFee: '152', note:'Macchina nuova', place:'Car Shop', key:'2'},
    ]);
    
    
    return(
        <View style={globalStyles.container}>

            <Modal visible={modalOpen} animationType="slide">
               <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={globalStyles.modalOverlay}>  

                            <View style={globalStyles.modalContent}>                        
                                <TransactionForm/>
                                <ButtonCircular onPress={() => setModalOpen(false)} icon='close'/>
                            </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <FlatList 
                data={transactions}
                renderItem={( {item} ) => (
                    <TouchableOpacity onPress={()=> navigation.navigate('TransactionDetails', item)}>
                        <Card>
                            <View style={globalStyles.transactionCard}>
                                <View style={globalStyles.transactionCard}>
                                    <MaterialIcons name={item.category[0]} style={globalStyles.icons} />
                                    <Text style={globalStyles.transactionCategoryText}>{item.category[1]}</Text>
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