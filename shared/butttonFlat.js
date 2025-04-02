import React from "react";
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

export default function ButtonFlat({ title, onPress }) {

    return(
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button:{
        borderRadius: 8,
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: 'orange'
    },
    buttonText:{
        color: 'black',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 16,
        textAlign: 'center'
    }
})