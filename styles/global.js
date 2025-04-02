import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({

    container: {
        flex: 1
    },
    transactionCard:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },    
    transactionAmount: {
        fontSize: 20,
        paddingRight: 10,
        justifyContent: 'flex-end',

    },
    transactionCategoryText: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    icons:{
        paddingRight: 20,
        fontSize: 25,
        verticalAlign: 'middle'
    },
    info:{
        flexDirection: 'row',
        paddingTop: 16,
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    infoText:{
        fontSize: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'center', // Center the modal vertically
        alignItems: 'center', // Center the modal horizontally
    },
    modalContent: {
        //alignItems: 'flex-end',
        width: '100%', // 80% of the screen width
        height:'80%',
        backgroundColor: 'white', // Modal background color
        borderRadius: 20, // Rounded corners
        padding: 20, // Padding inside the modal
        elevation: 5, // Shadow for Android
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    inputContainer:{
        flexDirection:'row',
        padding: 10,
        width: '100%',
        alignItems: 'center',
    },
    input:{
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
        //marginTop: 10
    },

});