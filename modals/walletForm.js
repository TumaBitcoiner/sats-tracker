import React, {useState} from "react";
import {View, TextInput, Text, TouchableOpacity, 
    Modal, TouchableWithoutFeedback, ScrollView, StyleSheet} from 'react-native';
import { globalStyles } from "../styles/global";
import {Formik} from 'formik'
import { MaterialIcons } from "@expo/vector-icons";
import ButtonFlat from "../shared/butttonFlat";
import {walletsArray} from "../styles/categories";
import {WalletTypeChoice} from "./walletTypeChoice";
import * as yup from 'yup';
import ButtonCircular from "../shared/buttonCircular";

const reviewSchema = yup.object({

    name: yup.string()
        .required('Please give a name to your wallet'),
    type: yup.string()
        .required()
        .notOneOf(['No wallet type selected..'], 'Please select a wallet type'),
    balance: yup.number()
    .nullable()
    .transform((value, originalValue) => 
        String(originalValue).trim() === '' ? null : value)
    .test('isValidBalance', 'Balance cannot be negative', 
        value => value === null || value >= 0)
})

export default function WalletForm({addNewWallet, onPress}){

    const [walletType, setWalletTypeOpen] = useState(false);

    return(
        <View style={globalStyles.container}>

            
            <Formik
            
                initialValues={{ 
                    name: '',
                    type: 'No wallet type selected..',
                    balance: 0,
                    note: '',
                }}
                validationSchema={reviewSchema}
                onSubmit={(values)=>{
                    addNewWallet(values);
                }}
            >

                {(formikProps) => (                    
                    <View style={styles.formContainer}>
                        <ScrollView style={styles.scrollContent}>
                            {/* Amount */}
                            <View style={globalStyles.inputContainer}>
                                <MaterialIcons name='account-balance-wallet' style={globalStyles.icons} />
                                
                                <TextInput
                                    style={globalStyles.input}
                                    placeholder='Wallet name...'
                                    onChangeText={formikProps.handleChange('name')}
                                    value={formikProps.values.name}
                                    onBlur={formikProps.handleBlur('name')}
                                />                            
                            </View>
                            
                            {/* Category */}
                            <Modal visible={walletType} animationType="slide">
                                
                                <TouchableWithoutFeedback onPress={() => setWalletTypeOpen(false)}>
                                    <View style={globalStyles.modalOverlay}>  
                
                                            <View style={globalStyles.modalContent}>                        
                                                
                                                <WalletTypeChoice onPress={(item) => {
                                                        setWalletTypeOpen(false);
                                                        console.log(item[1]);
                                                        formikProps.setFieldValue('type', item[1]); 
                                                    }}
                                                />
                                                
                                            </View>
                                    </View>
                                </TouchableWithoutFeedback>
                                                            
                            </Modal>

                            <TouchableOpacity onPress={() => setWalletTypeOpen(true)}>
                                <View style={globalStyles.inputContainer}>   
                                    
                                    <MaterialIcons 
                                        name={walletsArray.type[formikProps.values.type][0]} 
                                        style={globalStyles.icons} />
                                    
                                    <Text style={globalStyles.infoText} >
                                        {walletsArray.type[formikProps.values.type][1]}
                                    </Text>
                                        
                                    <MaterialIcons name='arrow-forward-ios' style={{...globalStyles.icons, ...{position: 'absolute', right: 0}}} />
    
                                </View>
                            </TouchableOpacity>               

                            <View style={globalStyles.inputContainer}>
                                <MaterialIcons name='savings' style={globalStyles.icons} />
                                
                                <TextInput
                                    style={globalStyles.input}
                                    placeholder="0"
                                    onChangeText={formikProps.handleChange('balance')}
                                    value={formikProps.values.balance}
                                    onBlur={formikProps.handleBlur('balance')}
                                    keyboardType="numeric"
                                />

                                
                            </View>

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
                                {formikProps.errors.name && formikProps.touched.name ? (
                                    <Text style={globalStyles.errorText}>{formikProps.errors.name}</Text>
                                ) : null}
                                
                                {formikProps.errors.type && formikProps.touched.type ? (
                                    <Text style={globalStyles.errorText}>{formikProps.errors.type}</Text>
                                ) : null}
                                
                                {formikProps.errors.balance && formikProps.touched.balance ? (
                                    <Text style={globalStyles.errorText}>{formikProps.errors.balance}</Text>
                                ) : null}

                            </View>

                            <ButtonFlat title='Add Wallet' onPress={formikProps.handleSubmit}/>
                        </View>

                        <ButtonCircular onPress={onPress} icon='close'/>
                        
                    </View>
                )}
            </Formik>
            
            
            
            
        </View>
    )
}


const styles = StyleSheet.create({
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