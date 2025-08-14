import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

export default function ButtonIcon({ icon, onPress }) {

    return(
        <TouchableOpacity onPress={onPress}>
            <MaterialIcons name={icon} style= {styles.icons} color='black'/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    icons:{
        padding: 20,
        fontSize: 30,
        verticalAlign: 'middle'
    },
});