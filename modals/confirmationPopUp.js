import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ButtonFlatIcon from '../shared/buttonFlatIcon';
import { globalStyles } from '../styles/global';

export default function ConfirmationPopUp({title, text, onConfirm, onCancel}){

    return(
        <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>{title}</Text>
            <Text style={styles.popupText}>{text}</Text>
            <View style={styles.popUpButtonsContainer}>
                <ButtonFlatIcon
                    text=""
                    icon="check"
                    onPress={onConfirm}
                />
                <ButtonFlatIcon
                    text=""
                    icon="close"
                    onPress={onCancel}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    popupContainer:{
        flex: 1,
        justifyContent: 'space-between',
    },
    popupTitle:{
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    popupText:{
        fontSize: 20,
        textAlign: 'center',
        //margin: 20,
    },
    popUpButtonsContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    }



})
