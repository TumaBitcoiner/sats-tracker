import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

export default function ButtonIcon({ icon, onPress }) {

    return(
        <TouchableOpacity onPress={onPress}>
            <MaterialIcons name={icon} size= {20} color='black'/>
        </TouchableOpacity>
    )
}