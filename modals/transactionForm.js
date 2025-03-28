import React, {useState} from "react";
import {StyleSheet, View, TextInput, Text, Button} from 'react-native';
import { globalStyles } from "../styles/global";
import {Formik}from 'formik'
import { MaterialIcons } from "@expo/vector-icons";

export default function TransactionForm(){

    return(
        <View style={globalStyles.container}>
            <Formik
            
                initialValues={{ 
                    amount: '',
                    transactionFee: '',
                    note: '',
                    place: '',
                }}
            >

                {(formikProps) => (
                    <View>
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
                    </View>
                )}
            </Formik>
            
            
            
            
        </View>
    )
}