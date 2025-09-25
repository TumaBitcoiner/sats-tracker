import {StyleSheet, Text, View} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'; // Assuming already installed and provider is at root
import { globalStyles } from "../styles/global";

export default function Header({title}) {

    return(  

        <SafeAreaView style={globalStyles.safeAreaContainer}>
            <View>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{title}</Text>
                    
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