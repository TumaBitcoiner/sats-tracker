import React, {useState} from "react";
import {View, TextInput, Text, TouchableOpacity, 
    Modal, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { globalStyles } from "../styles/global";
import {Formik} from 'formik'
import { MaterialIcons } from "@expo/vector-icons";
import ButtonFlat from "../shared/butttonFlat";
import {walletsArray} from "../styles/categories";
import {WalletTypeChoice} from "./walletTypeChoice";

export default function WalletForm({addNewWallet}){

    const [walletType, setWalletTypeOpen] = useState(false);

    return(
        <View >

            
            <Formik
            
                initialValues={{ 
                    name: '',
                    type: 'No wallet type selected..',
                    balance: 0,
                    note: '',
                }}
                onSubmit={(values)=>{
                    addNewWallet(values);
                }}
            >

                {(formikProps) => (                    
                    <View>

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

                        <ButtonFlat title='Add Wallet' onPress={formikProps.handleSubmit}/>
                    </View>
                )}
            </Formik>
            
            
            
            
        </View>
    )
}