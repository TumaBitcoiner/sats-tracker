import {useState, useEffect} from "react";
import {View, TextInput, Text, TouchableOpacity, 
    Modal, TouchableWithoutFeedback, Switch, StyleSheet, ScrollView
} from 'react-native';
import { globalStyles } from "../../styles/global";
import {Formik} from 'formik'
import { MaterialIcons } from "@expo/vector-icons";
import ButtonFlat from "../../shared/butttonFlat";
import DatePicker from 'react-native-date-picker';
import { getLNWallets, getOCWallets, getWallet } from '../../database/database';
import {WalletChoice} from "../walletChoice";
import * as yup from 'yup';
import ButtonCircular from '../../shared/buttonCircular';

export default function SwapFunds({swapFunds, onPress, outWalletId}){

    const [dateOpen, setDateOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [walletOpen, setWalletOpen] = useState(false);
    const [walletList, setWalletList] = useState([]);
    const [walletType, setWalletType] = useState('OC');
    const [selectedWalletName, setSelectedWalletName] = useState('No wallet selected..');
    const [outWalletName, setOutWalletName] = useState('No wallet selected..');
    const [outWalletType, setOutWalletType] = useState('OC');
    const [outWalletBalance, setOutWalletBalance] = useState(0);

    const createValidationSchema = () => {
    
        console.log('Creating validation schema with balance:', outWalletBalance);
        return yup.object({
            amount: yup.number()
                .required('Amount is required')
                .positive('Amount must be positive')
                .test(
                    'max-amount', 
                    `Amount exceeds available wallet balance: ${outWalletBalance} sats`, 
                    function(value) {
                    const { transactionFee } = this.parent;
                    const totalSpend = Number(value || 0) + Number(transactionFee || 0);
                    return totalSpend <= outWalletBalance;
                    }
                ),
            transactionFee: yup.number()
                .min(0)
                .integer()
                .test(
                    'max-transactionFee', 
                    `Fee exceeds available wallet balance: ${outWalletBalance} sats`, 
                    function(value) {
                    const { amount } = this.parent;
                    const totalSpend = Number(amount || 0) + Number(value || 0);
                    return totalSpend <= outWalletBalance;
                    }
                ),
            walletId: yup.number()
                .required()
                .min(1, 'Please select a wallet'),
            category: yup.string()
                .required()
                .notOneOf(['No category selected..'], 'Please select a category'),
        });
    };

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

    const getOutWallet = async (outWalletId) => {
        try {
            const wallet = await getWallet(outWalletId);
            setOutWalletName(wallet[0].name);
            setOutWalletType(wallet[0].type);
            setOutWalletBalance(wallet[0].balance);
            
        } catch (error) { 
            console.error('Error fetching wallet name:', error);
        }
    }

    useEffect(() => {
        const initializeWallet = async () => {
            await loadWallets(walletType);
        };

        initializeWallet();        
        getOutWallet(outWalletId)
    }, []);

    return(
        <View style={globalStyles.container}>

            {/* <Text style={{...globalStyles.sectionHeaderText, ...{fontSize: 30, padding: 20}}}> Swap Funds</Text> */}
            <Formik
            
                initialValues={{ 
                    amount: 0,
                    transactionFee: 0,
                    note: '',
                    place: '',
                    date: new Date(),
                    categoryIn: 'Swap In',
                    categoryOut: 'Swap Out',
                    isExpensesOut: true,
                    isExpensesIn: false,
                    walletIdIn: 0,
                    walletIdOut: outWalletId,
                    transactionTypeIn: walletType,
                    transactionTypeOut: outWalletType,
                }}
                validationSchema={createValidationSchema()}
                onSubmit={(values)=>{
                    swapFunds(values);
                }}
            >

                {(formikProps) => (                    
                    <View style={styles.formContainer}>
                        <ScrollView style={styles.scrollContent}>
                            {/* Transaction Type */}

                            <Text style={{...globalStyles.sectionHeaderText, ...{padding: 5}}}> From:</Text>
                            <View style={{...globalStyles.inputContainer, ...{justifyContent: 'space-between'}}}>
                                <View style={styles.walletSelector}>
                                
                                        
                                    <MaterialIcons 
                                        name={outWalletType === 'LN' ? 'bolt' : 'currency-bitcoin'} 
                                        style={globalStyles.icons} />
                                    
                                    <Text style={globalStyles.infoText} >
                                        {outWalletName}
                                    </Text>
                                </View> 
                            </View>

                            <Text style={{...globalStyles.sectionHeaderText, ...{padding: 5}}}> To:</Text>
                            <View style={{...globalStyles.inputContainer, ...{justifyContent: 'space-between'}}}>
                                <TouchableOpacity onPress={() => setWalletOpen(true)} style={styles.walletSelector}>
                                
                                        
                                    <MaterialIcons 
                                        name={formikProps.values.transactionTypeIn === 'LN' ? 'bolt' : 'currency-bitcoin'} 
                                        style={globalStyles.icons} />
                                    
                                    <Text style={globalStyles.infoText} >
                                        {selectedWalletName}
                                    </Text>
                                        
                                    <MaterialIcons name='arrow-forward-ios' style={styles.arrowIcon} />

                                
                                </TouchableOpacity> 
                                <View style={styles.switchContainer}>
                                <Switch
                                    style={[{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }]}
                                    value={formikProps.values.transactionTypeIn === 'LN'}
                                    onValueChange={(value) => {
                                        const newType = value ? 'LN' : 'OC';
                                        console.log(newType);
                                        formikProps.setFieldValue('transactionTypeIn', newType);
                                        formikProps.setFieldValue('walletIdIn', 0); // Reset wallet selection
                                        setSelectedWalletName('No wallet selected..');
                                        setWalletType(newType);
                                        loadWallets(newType);
                                    }}
                                    trackColor={{ false: '#ff4444', true: '#00C851' }}
                                    thumbColor={formikProps.values.transactionTypeIn === 'LN' ? '#00C851' : '#ff4444'}
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
                                                        formikProps.setFieldValue('walletIdIn', walletId);
                                                        setWalletOpen(false);
                                                        setSelectedWalletName(name);
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
                                    placeholder="Transaction Amount"
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
                                    placeholder="Transaction Fee"
                                    onChangeText={formikProps.handleChange('transactionFee')}
                                    value={formikProps.values.transactionFee}
                                    onBlur={formikProps.handleBlur('transactionFee')}
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
                        </ScrollView>

                        <View style={globalStyles.errorAndButtonContainer}>

                            {/* Update error display */}
                            <View style={globalStyles.errorContainer}>
                                {formikProps.errors.amount && formikProps.touched.amount ? (
                                    <Text style={globalStyles.errorText}>{formikProps.errors.amount}</Text>
                                ) : null}
                                
                                {formikProps.errors.walletId && formikProps.touched.walletId ? (
                                    <Text style={globalStyles.errorText}>{formikProps.errors.walletId}</Text>
                                ) : null}
                                
                                {formikProps.errors.category && formikProps.touched.category ? (
                                    <Text style={globalStyles.errorText}>{formikProps.errors.category}</Text>
                                ) : null}

                            </View>

                            <ButtonFlat title={'Swap Funds'} onPress={formikProps.handleSubmit}/>
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