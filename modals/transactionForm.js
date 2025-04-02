import React, {useState} from "react";
import {View, TextInput, Text, TouchableOpacity, 
    Modal, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { globalStyles } from "../styles/global";
import {Formik} from 'formik'
import { MaterialIcons } from "@expo/vector-icons";
import ButtonFlat from "../shared/butttonFlat";
import DatePicker from 'react-native-date-picker';
import CategoryChoice from "./categoryChoice";
import TopTabNavigatorCategories from "../routes/topTabNavigatorCategory";

export default function TransactionForm(){

    const [dateOpen, setDateOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [category, setCategory] = useState('question-mark');

    return(
        <View >

            
            <Formik
            
                initialValues={{ 
                    amount: '',
                    transactionFee: '',
                    note: '',
                    place: '',
                    date: new Date(),
                    category: 'No category selected..'
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

                        <DatePicker
                            modal
                            open={dateOpen}
                            date={new Date()}
                            mode='date'
                            onConfirm={(selectedDate) => {
                                setDateOpen(false)
                                formikProps.setFieldValue('date', selectedDate); // Update Formik's date field

                            }}
                            onCancel={() => {
                                setDateOpen(false)
                            }}
                        />

                        {/* Date */}
                        <TouchableOpacity onPress={() => setDateOpen(true)}>
                            <View style={globalStyles.inputContainer}>    
                                
                                <MaterialIcons name='calendar-month' style={globalStyles.icons} />
                                                            
                                <Text style={globalStyles.infoText} >{formikProps.values.date.toLocaleDateString()}</Text>
                                
                                <MaterialIcons name='arrow-forward-ios' style={{...globalStyles.icons, ...{position: 'absolute', right: 0}}} />

                            </View>
                        </TouchableOpacity>
                        
                        {/* Category */}
                        <Modal visible={categoryOpen} animationType="slide">
                            
                            <TouchableWithoutFeedback onPress={() => setCategoryOpen(false)}>
                                <View style={globalStyles.modalOverlay}>  
            
                                        <View style={globalStyles.modalContent}>                        
                                            
                                            <TopTabNavigatorCategories onPress={(item) => {
                                                    setCategoryOpen(false);
                                                    formikProps.setFieldValue('category', item[1]); 
                                                    setCategory(item[0]);
                                                    
                                                }}
                                            />
                                            
                                        </View>
                                </View>
                            </TouchableWithoutFeedback>
                                                        
                        </Modal>

                        <TouchableOpacity onPress={() => setCategoryOpen(true)}>
                            <View style={globalStyles.inputContainer}>   
                                
                                <MaterialIcons name={category} style={globalStyles.icons} />
                                
                                <Text style={globalStyles.infoText} >{formikProps.values.category}</Text>
                                    
                                <MaterialIcons name='arrow-forward-ios' style={{...globalStyles.icons, ...{position: 'absolute', right: 0}}} />
  
                            </View>
                        </TouchableOpacity>               

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

                        <ButtonFlat title='Add Expense'/>
                    </View>
                )}
            </Formik>
            
            
            
            
        </View>
    )
}