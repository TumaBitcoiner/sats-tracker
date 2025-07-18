import {useState, useEffect} from "react";
import {View, TextInput, Text, TouchableOpacity, 
    StyleSheet, ScrollView
} from 'react-native';
import { globalStyles } from "../../styles/global";
import {Formik} from 'formik'
import { MaterialIcons } from "@expo/vector-icons";
import ButtonFlat from "../../shared/butttonFlat";
import DatePicker from 'react-native-date-picker';
import { getWallet } from '../../database/database';
import * as yup from 'yup';
import ButtonCircular from '../../shared/buttonCircular';


const reviewSchema = yup.object({

    transactionFee: yup.number()
        .required()
        .positive()
        .integer(),
})

export default function ConsolidateFunds({consolidateFunds, onPress, outWalletId}){

    const [dateOpen, setDateOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [outWalletName, setOutWalletName] = useState('OC');
    const [outWalletType, setOutWalletType] = useState('OC');

    const getOutWallet = async (outWalletId) => {
        try {
            const wallet = await getWallet(outWalletId);
            setOutWalletName(wallet[0].name);
            setOutWalletType(wallet[0].type);
            
        } catch (error) { 
            console.error('Error fetching wallet name:', error);
        }
    }

    useEffect(() => {
              
        getOutWallet(outWalletId)
    }, []);

    return(
        <View style={globalStyles.container}>
 
            <Formik
            
                initialValues={{ 
                    amount: 0,
                    transactionFee: 0,
                    note: '',
                    place: '',
                    date: new Date(),
                    category: 'Consolidation',
                    isExpenses: true,
                    walletId: outWalletId,
                    transactionType: outWalletType,
                }}
                validationSchema={reviewSchema}
                onSubmit={(values)=>{
                    consolidateFunds(values);
                }}
            >

                {(formikProps) => (                    
                    <View style={styles.formContainer}>
                        <ScrollView style={styles.scrollContent}>
                            {/* Transaction Type */}

                            <Text style={{...globalStyles.sectionHeaderText, ...{padding: 5}}}> Consolidate:</Text>
                            <View style={{...globalStyles.inputContainer, ...{justifyContent: 'space-between'}}}>
                                <View style={styles.walletSelector}>
                                
                                        
                                    <MaterialIcons 
                                        name={'currency-bitcoin'} 
                                        style={globalStyles.icons} />
                                    
                                    <Text style={globalStyles.infoText} >
                                        {outWalletName}
                                    </Text>
                                </View> 
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

                            <ButtonFlat title={'Consolidate Funds'} onPress={formikProps.handleSubmit}/>
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