import { MaterialIcons } from '@expo/vector-icons'
import React, {useState} from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native'

export default function ButtonAdd({onPress}){

    return(
        <TouchableOpacity style={styles.button}>
            <MaterialIcons name='add' size= {45} color='black' onPress={onPress}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    button:{     
        height: 60,
        width: 60,   
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: 'orange',
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    }
})