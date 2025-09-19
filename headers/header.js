import React from "react";
import {StyleSheet, Text, View} from 'react-native'
import {MaterialIcons} from '@expo/vector-icons'

export default function Header({title}) {

    return(  
        <View>
            <View style={styles.header}>
                <Text style={styles.headerText}>{title}</Text>
                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header:{
        width: '100%', 
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7931a',
        //elevation: 8,
    },
    headerText:{
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black',
        letterSpacing: 1
    },
    headerTitle:{
        flexDirection: 'row'
    }

});