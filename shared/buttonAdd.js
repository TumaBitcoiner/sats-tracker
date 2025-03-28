import { MaterialIcons } from '@expo/vector-icons'
import React, {useState} from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native'

export default function ButtonAdd({onPress}){

    return(
        <TouchableOpacity style={styles.button}>
            <MaterialIcons name='add' size= {50} color='black' onPress={onPress}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    button:{        
        alignItems: 'center',
        justifyContent: 'center',
    }
})