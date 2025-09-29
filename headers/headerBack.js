import React from "react";
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'; // Assuming already installed and provider is at root
import { globalStyles } from "../styles/global";

export default function HeaderBack({headerTitle, navigation, onOptionPress}) {

    return( 

    <SafeAreaView style={globalStyles.safeAreaContainer}>

        <View style={styles.header}>

            <TouchableOpacity style={styles.headerIconLeft} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back"  size={30} color="black" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>{headerTitle}</Text>
            </View>
        </View>

    </SafeAreaView>
        
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
        //paddingBottom: 16
    },
    // headerIconContainer:{
    //     position: 'absolute',
    //     right: 10,
    //     flexDirection: 'row'
    // },
    headerIconLeft:{
        //paddingLeft: 20,
        position: 'absolute',
        left: 10
    },
    headerIconRight:{
        position: 'absolute',
        right: 10
    },
    headerTextContainer:{
        //justifyContent: 'center',
    },
    headerText:{
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black',
        letterSpacing: 1,
    },
    headerTitle:{
        flexDirection: 'row'
    },
});