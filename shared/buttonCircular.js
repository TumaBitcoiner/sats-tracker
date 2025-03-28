import { MaterialIcons } from '@expo/vector-icons'
import { StyleSheet, TouchableOpacity} from 'react-native'

export default function ButtonCircular({onPress, icon}){

    return(
        <TouchableOpacity style={styles.button}>
            <MaterialIcons name={icon} size= {45} color='black' onPress={onPress}/>
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