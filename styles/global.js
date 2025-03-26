import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({

    transactionCard:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },    
    transactionAmount: {
        fontSize: 20,
        paddingRight: 10,

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
    }

});