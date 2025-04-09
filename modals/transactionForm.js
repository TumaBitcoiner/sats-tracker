import React, {useState, useEffect} from "react";
import {View, TextInput, Text, TouchableOpacity, 
    Modal, TouchableWithoutFeedback, Switch, StyleSheet
} from 'react-native';
import { globalStyles } from "../styles/global";
import {Formik} from 'formik'
import { MaterialIcons } from "@expo/vector-icons";
import ButtonFlat from "../shared/butttonFlat";
import DatePicker from 'react-native-date-picker';
import {categoryArray} from "../styles/categories";
import TopTabNavigatorCategories from "../routes/topTabNavigatorCategory";
import { getLNWallets, getOCWallets } from '../database/database';
import {WalletChoice} from "./walletChoice";

export default function TransactionForm({addNewTransaction}){

    const [dateOpen, setDateOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [walletOpen, setWalletOpen] = useState(false);
    const [walletList, setWalletList] = useState([]);
    const [selectedWalletName, setSelectedWalletName] = useState('No wallet selected..');
    const [walletType, setWalletType] = useState('OC');

    const loadWallets = async (type) => {
        try {
            const fetchedWallets = type === 'LN' ? 
                await getLNWallets() : 
                await getOCWallets();
                setWalletList(fetchedWallets);
            //setWalletOpen(true); // Open wallet selector after loading
        } catch (error) {
            console.error('Error loading wallets:', error);
        }
    };

    
    useEffect(() => {
            loadWallets(walletType);
    }, []);

    return(
        <View >

            
            <Formik
            
                initialValues={{ 
                    amount: 0,
                    transactionFee: 0,
                    note: '',
                    place: '',
                    date: new Date(),
                    category: 'No category selected..',
                    isExpenses: true,
                    walletId: 0,
                    transactionType: walletType,
                }}
                onSubmit={(values)=>{
                    addNewTransaction(values);
                }}
            >

                {(formikProps) => (                    
                    <View>

                        {/* Amount */}
                        <View style={globalStyles.inputContainer}>
                            <MaterialIcons name='money' style={globalStyles.icons} />
                            
                            <TextInput
                                style={globalStyles.input}
                                placeholder="How much?"
                                onChangeText={formikProps.handleChange('amount')}
                                value={formikProps.values.amount}
                                onBlur={formikProps.handleBlur('amount')}
                                keyboardType="numeric"
                            />

                            
                        </View>

                        {/* Transaction Fee */}
                        <View style={globalStyles.inputContainer}>
                            <MaterialIcons name='money' style={globalStyles.icons} />
                            
                            <TextInput
                                style={globalStyles.input}
                                placeholder="How much to miners?"
                                onChangeText={formikProps.handleChange('transactionFee')}
                                value={formikProps.values.transactionFee}
                                onBlur={formikProps.handleBlur('transactionFee')}
                                keyboardType="numeric"
                            />
                            
                        </View>                        

                        {/* Transaction Type */}
                        <View style={{...globalStyles.inputContainer, ...{justifyContent: 'space-between'}}}>
                            <TouchableOpacity onPress={() => setWalletOpen(true)} style={styles.walletSelector}>
                               
                                    
                                <MaterialIcons 
                                    name={formikProps.values.transactionType === 'LN' ? 'bolt' : 'currency-bitcoin'} 
                                    style={globalStyles.icons} />
                                
                                <Text style={globalStyles.infoText} >
                                    {selectedWalletName}
                                </Text>
                                    
                                <MaterialIcons name='arrow-forward-ios' style={styles.arrowIcon} />

                              
                            </TouchableOpacity> 
                            <View style={styles.switchContainer}>
                            <Switch
                                style={[{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }]}
                                value={formikProps.values.transactionType === 'LN'}
                                onValueChange={(value) => {
                                    const newType = value ? 'LN' : 'OC';
                                    console.log(newType);
                                    formikProps.setFieldValue('transactionType', newType);
                                    formikProps.setFieldValue('walletId', 0); // Reset wallet selection
                                    setSelectedWalletName('No wallet selected..');
                                    setWalletType(newType);
                                    loadWallets(newType);
                                }}
                                trackColor={{ false: '#ff4444', true: '#00C851' }}
                                thumbColor={formikProps.values.transactionType === 'LN' ? '#00C851' : '#ff4444'}
                            />
                            </View>
                        </View>

                        {/* Wallet */}
                        <Modal visible={walletOpen} animationType="slide">
                            
                            <TouchableWithoutFeedback onPress={() => setWalletOpen(false)}>
                                <View style={globalStyles.modalOverlay}>  
            
                                        <View style={globalStyles.modalContent}>                        
                                            
                                            <WalletChoice 
                                                walletList={walletList}
                                                onPress={(walletId, type, name) => {
                                                    formikProps.setFieldValue('walletId', walletId);
                                                    setWalletOpen(false);
                                                    setSelectedWalletName(name);
                                                }}
                                            />                                            
                                        </View>
                                </View>
                            </TouchableWithoutFeedback>
                                                        
                        </Modal>    

                        {/* Place */}
                        <View style={globalStyles.inputContainer}>
                            <MaterialIcons name='place' style={globalStyles.icons} />
                            

                            <TextInput
                                style={globalStyles.input}
                                placeholder="Where?"
                                onChangeText={formikProps.handleChange('place')}
                                value={formikProps.values.place}
                                onBlur={formikProps.handleBlur('place')}
                                keyboardType="numeric"
                            />
                            
                        </View>

                        {/* Date */}
                        <DatePicker
                            modal
                            open={dateOpen}
                            date={date}
                            mode='date'
                            onConfirm={(date) => {
                                setDateOpen(false);
                                setDate(date);
                                console.log(date);
                                //setStringDate(selectedDate.toLocaleDateString()); // Convert to string
                                formikProps.setFieldValue('date', date); // Update Formik's date field

                            }}
                            onCancel={() => {
                                setDateOpen(false);
                            }}
                        />

                        <TouchableOpacity onPress={() => setDateOpen(true)}>
                            <View style={globalStyles.inputContainer}>    
                                
                                <MaterialIcons name='calendar-month' style={globalStyles.icons} />
                                                            
                                <Text style={globalStyles.infoText} >{formikProps.values.date.toDateString()}</Text>
                                
                                <MaterialIcons name='arrow-forward-ios' style={{...globalStyles.icons, ...{position: 'absolute', right: 0}}} />

                            </View>
                        </TouchableOpacity>
                        
                        {/* Category */}
                        <Modal visible={categoryOpen} animationType="slide">
                            
                            <TouchableWithoutFeedback onPress={() => setCategoryOpen(false)}>
                                <View style={globalStyles.modalOverlay}>  
            
                                        <View style={globalStyles.modalContent}>                        
                                            
                                            <TopTabNavigatorCategories onPress={(item, isExpenses) => {
                                                    setCategoryOpen(false);
                                                    console.log(item[1]);
                                                    formikProps.setFieldValue('category', item[1]); 
                                                    //setCategory(index);
                                                    //setIsExpenses(isExpenses);
                                                    formikProps.setFieldValue('isExpenses', isExpenses);
                                                }}
                                            />
                                            
                                        </View>
                                </View>
                            </TouchableWithoutFeedback>
                                                        
                        </Modal>

                        <TouchableOpacity onPress={() => setCategoryOpen(true)}>
                            <View style={globalStyles.inputContainer}>   
                                
                                <MaterialIcons 
                                    name={formikProps.values.isExpenses
                                            ? categoryArray.expenses[formikProps.values.category][0]
                                            : categoryArray.income[formikProps.values.category][0]} 
                                    style={globalStyles.icons} />
                                
                                <Text style={globalStyles.infoText} >
                                    {formikProps.values.isExpenses
                                        ? categoryArray.expenses[formikProps.values.category][1]
                                        : categoryArray.income[formikProps.values.category][1]}
                                </Text>
                                    
                                <MaterialIcons name='arrow-forward-ios' style={{...globalStyles.icons, ...{position: 'absolute', right: 0}}} />
  
                            </View>
                        </TouchableOpacity>               

                        {/*Note*/}
                        <View style={globalStyles.inputContainer}>                      

                            <TextInput
                                multiline
                                numberOfLines={4}
                                style={globalStyles.input}
                                placeholder="Note"
                                onChangeText={formikProps.handleChange('note')}
                                value={formikProps.values.note}
                                onBlur={formikProps.handleBlur('note')}
                                
                            />
                        </View>

                        <ButtonFlat title='Add Expense' onPress={formikProps.handleSubmit}/>
                    </View>
                )}
            </Formik>
            
            
            
            
        </View>
    )
}

const styles = StyleSheet.create({
    arrowIcon: {
        ...globalStyles.icons,
        position: 'absolute',
        right: 0
    },
    switchContainer: {
        //position: 'absolute',
        //right: 0,
        paddingLeft: 16
    },
    walletSelector: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20
    },
})