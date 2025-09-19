import React from "react";
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { globalStyles } from "../styles/global";

export default function ButtonFlatIcon({ title, icon, onPress }) {

    return(
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
            <MaterialIcons name={icon} size= {35} color='black'/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button:{
        borderRadius: 8,
        width: 150,
        height: 65,
        backgroundColor: '#f7931a',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    buttonText:{
        color: 'black',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 16,
        textAlign: 'center'
    }
})