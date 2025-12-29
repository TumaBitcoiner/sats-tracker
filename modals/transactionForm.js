import React, {useState, useEffect} from "react";
import {View, TextInput, Text, TouchableOpacity, 
    Modal, TouchableWithoutFeedback, Switch, StyleSheet, ScrollView
} from 'react-native';
import { globalStyles } from "../styles/global";
import {Formik} from 'formik'
import { MaterialIcons } from "@expo/vector-icons";
import ButtonFlat from "../shared/butttonFlat";
import DatePicker from 'react-native-date-picker';
import {categoryArray} from "../styles/categories";
import TopTabNavigatorCategories from "../routes/topTabNavigatorCategory";
import { getWallets, getWalletBalance } from '../database/database';
import {WalletChoice} from "./walletChoice";
import * as yup from 'yup';
import ButtonCircular from '../shared/buttonCircular';


const defaultReviewSchema = yup.object({

    amount: yup.number()
        .required()
        .positive()
        .integer(),
    transactionFee: yup.number()
        .min(0)
        .integer(),
    walletId: yup.number()
        .required()
        .min(1, 'Please select a wallet'),
    category: yup.string()
        .required()
        .notOneOf(['No category selected..'], 'Please select a category'),
})

export default function TransactionForm({addNewTransaction, onPress, initialValues = null, newTx = true}){

    const [dateOpen, setDateOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [walletOpen, setWalletOpen] = useState(false);
    const [walletList, setWalletList] = useState([]);
    const [walletType, setWalletType] = useState('OC');
    const [selectedWalletName, setSelectedWalletName] = useState('No wallet selected..');
    const [walletSelected, setWalletSelected] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    
    const createValidationSchema = () => {

        console.log('Creating validation schema with balance:', walletBalance);
        return yup.object({
            amount: yup.number()
                .required('Amount is required')
                .positive('Amount must be positive')
                .when('isExpenses', {
                    is: true,
                    then: (schema) => schema.test(
                        'max-amount', 
                        `Amount exceeds available wallet balance: ${walletBalance} sats`, 
                        function(value) {
                            const { transactionFee } = this.parent;
                            const totalSpend = Number(value || 0) + Number(transactionFee || 0);
                            return totalSpend <= walletBalance;
                        }
                    ),
                    otherwise: (schema) => schema
                }),
            transactionFee: yup.number()
                .min(0)
                .integer()
                .when('isExpenses', {
                    is: true,
                    then: (schema) => schema.test(
                        'max-transactionFee', 
                        `Fee exceeds available wallet balance: ${walletBalance} sats`, 
                        function(value) {
                            const { amount } = this.parent;
                            const totalSpend = Number(amount || 0) + Number(value || 0);
                            return totalSpend <= walletBalance;
                        }
                    ),
                    otherwise: (schema) => schema
                }),
            walletId: yup.number()
                .required()
                .min(1, 'Please select a wallet'),
            category: yup.string()
                .required()
                .notOneOf(['No category selected..'], 'Please select a category'),
        });
    };

    const fetchWalletBalance = async (walletId) => {
        try {

            const walletBalance = await getWalletBalance(walletId);
            
            if (!newTx && initialValues) {
                // If initialValues are provided, adjust the balance based on existing transaction values
                const adjustedBalance = walletBalance + (initialValues.amount || 0) + (initialValues.transactionFee || 0);
                setWalletBalance(adjustedBalance);
                console.log('Fetched adjusted wallet balance:', adjustedBalance);
                return adjustedBalance || 0;
            }
            else {
                setWalletBalance(walletBalance);
                console.log('Fetched wallet balance:', walletBalance);
                return walletBalance || 0; // Return 0 if balance is not found
            }
            
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
            return 0; // Return 0 if there's an error
        }
    };

    useEffect(() => {
        const initializeWallet = async () => {
            try {
                const fetchedWallets = await getWallets();
                setWalletList(fetchedWallets);
                
                if (initialValues?.walletId) {
                    const wallet = fetchedWallets.find(w => w.id === initialValues.walletId);
                    console.log('Initial wallet:', wallet);
                    if (wallet) {
                        setSelectedWalletName(wallet.name);
                        setWalletSelected(true);
                        setWalletBalance(fetchWalletBalance(initialValues.walletId));
                        setWalletType(initialValues.transactionType);
                    }
                }
            } catch (error) {
                console.error('Error loading wallets:', error);
            }
        };
        const initializeDate = () => {
            if (initialValues?.date) {
                const initDate = new Date(initialValues.date);
                setDate(initDate);
            }
        };
        
        initializeWallet();
        initializeDate();
    }, [initialValues]);

    return(
        <View style={globalStyles.container}>
            <Formik
            
                initialValues={initialValues || { 
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
                validationSchema={walletSelected ? createValidationSchema() : defaultReviewSchema}
                onSubmit={(values)=>{
                    addNewTransaction(values);
                }}
            >

                {(formikProps) => (                    
                    <View style={styles.formContainer}>
                        <ScrollView style={styles.scrollContent}>
                            {/* Transaction Type */}
                            <TouchableOpacity onPress={() => setWalletOpen(true)}>
                                <View style={globalStyles.inputContainer}>
                            
                                    
                                    <MaterialIcons 
                                        name={formikProps.values.transactionType === 'LN' ? 'bolt' : 'currency-bitcoin'} 
                                        style={globalStyles.icons} />
                                    
                                    <Text style={globalStyles.infoText} >
                                        {selectedWalletName}
                                    </Text>
                                        
                                    <MaterialIcons name='arrow-forward-ios' style={styles.arrowIcon} />

                                </View>
                            </TouchableOpacity> 

                            {/* Wallet */}
                            <Modal visible={walletOpen} animationType="slide">
                                
                                <TouchableWithoutFeedback onPress={() => setWalletOpen(false)}>
                                    <View style={globalStyles.modalOverlay}>  
                
                                            <View style={globalStyles.modalContent}>                        
                                                
                                                <WalletChoice 
                                                    walletList={walletList}
                                                    onPress={(walletId, type, name) => {
                                                        formikProps.setFieldValue('walletId', walletId);
                                                        formikProps.setFieldValue('transactionType', type);
                                                        fetchWalletBalance(walletId);
                                                        setWalletSelected(true);
                                                        setWalletOpen(false);
                                                        setSelectedWalletName(name);
                                                        setWalletType(type);
                                                    }}
                                                />                                            
                                            </View>
                                    </View>
                                </TouchableWithoutFeedback>
                                                            
                            </Modal>    

                            {/* Amount */}
                            <View style={globalStyles.inputContainer}>
                                <MaterialIcons name='money' style={globalStyles.icons} />
                                
                                <TextInput
                                    style={globalStyles.input}
                                    placeholder="How much?"
                                    onChangeText={formikProps.handleChange('amount')}
                                    value={newTx? formikProps.values.amount : formikProps.values.amount.toString()}
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
                                    value={newTx? formikProps.values.transactionFee : formikProps.values.transactionFee.toString()}
                                    onBlur={formikProps.handleBlur('transactionFee')}
                                    keyboardType="numeric"
                                />
                                
                            </View>                        


                            {/* Place */}
                            <View style={globalStyles.inputContainer}>
                                <MaterialIcons name='place' style={globalStyles.icons} />
                                

                                <TextInput
                                    style={globalStyles.input}
                                    placeholder="Where?"
                                    onChangeText={formikProps.handleChange('place')}
                                    value={formikProps.values.place}
                                    onBlur={formikProps.handleBlur('place')}
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

                                <View style={globalStyles.inputContainer}>    
                                    
                                    <TouchableOpacity 
                                        onPress={() => {
                                            const today = new Date();
                                            setDate(today);
                                            formikProps.setFieldValue('date', today);
                                        }}
                                    >
                                        <MaterialIcons name='calendar-month' style={{...globalStyles.icons, color: '#f7931a'}} />
                                    </TouchableOpacity>
                                                                
                                    <TouchableOpacity onPress={() => setDateOpen(true)} style={globalStyles.inputTouchable}>
                                        <Text style={globalStyles.infoText} >{formikProps.values.date.toDateString()}</Text>
                                    
                                        <MaterialIcons name='arrow-forward-ios' style={{...globalStyles.icons, ...{position: 'absolute', right: 0}}} />
                                    </TouchableOpacity>

                                </View>
                            
                            {/* Category */}
                            <Modal visible={categoryOpen} animationType="slide">
                                
                                <TouchableWithoutFeedback onPress={() => setCategoryOpen(false)}>
                                    <View style={globalStyles.modalOverlay}>  
                
                                            <View style={globalStyles.modalContent}>                        
                                                
                                                <TopTabNavigatorCategories onPress={(item, isExpenses) => {
                                                        setCategoryOpen(false);
                                                        console.log(item[1]);
                                                        formikProps.setFieldValue('category', item[1]); 
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
                        </ScrollView>

                        <View style={globalStyles.errorAndButtonContainer}>

                            {/* Update error display */}
                            <View style={globalStyles.errorContainer}>
                                {formikProps.errors.amount && formikProps.touched.amount ? (
                                    <Text style={globalStyles.errorText}>{formikProps.errors.amount}</Text>
                                ) : null}

                                {formikProps.errors.transactionFee && formikProps.touched.transactionFee ? (
                                    <Text style={globalStyles.errorText}>{formikProps.errors.transactionFee}</Text>
                                ) : null}
                                
                                {formikProps.errors.walletId && formikProps.touched.walletId ? (
                                    <Text style={globalStyles.errorText}>{formikProps.errors.walletId}</Text>
                                ) : null}
                                
                                {formikProps.errors.category && formikProps.touched.category ? (
                                    <Text style={globalStyles.errorText}>{formikProps.errors.category}</Text>
                                ) : null}

                            </View>

                            <ButtonFlat title={newTx ? 'Add Transaction' : 'Edit Transaction'} onPress={formikProps.handleSubmit}/>
                        </View>
                        
                        <ButtonCircular onPress={onPress} icon='close'/>
                        
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
        paddingLeft: 16
    },
    walletSelector: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20
    },
    formContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    scrollContent: {
        flex: 1,
    },
    errorAndButtonContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: 'white', // Match your modal background
    }
})