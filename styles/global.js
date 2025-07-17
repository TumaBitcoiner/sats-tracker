import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({

    container: {
        flex: 1
    },
    transactionCard:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },    
    transactionAmountIncome: {
        fontSize: 15,
        paddingRight: 10,
        justifyContent: 'flex-end',
        color: 'green',
        fontWeight: 'bold',

    },
    transactionAmountExpense: {
        fontSize: 15,
        paddingRight: 10,
        justifyContent: 'flex-end',
        color: 'red',
        fontWeight: 'bold',

    },
    transactionCategoryText: {
        fontWeight: 'bold',
        fontSize: 15,
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
        //backgroundColor: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'center', // Center the modal vertically
        alignItems: 'center', // Center the modal horizontally
    },
    modalContent: {
        //alignItems: 'flex-end',
        width: '100%', // 80% of the screen width
        height:'90%',
        backgroundColor: 'white', // Modal background color
        borderRadius: 20, // Rounded corners
        padding: 20, // Padding inside the modal
        elevation: 5, // Shadow for Android
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    modalPopupContent: {
        width: '90%', // 80% of the screen width
        height:'40%',
        backgroundColor: 'white', // Modal background color
        borderRadius: 20, // Rounded corners
        padding: 20, // Padding inside the modal
        elevation: 5, // Shadow for Android
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    modalOptionsContent:{
        width: '60%',
        //height:'50%',
        backgroundColor: 'white', // Modal background color
        //borderRadius: 20, // Rounded corners
        //padding: 5, // Padding inside the modal
        elevation: 5, // Shadow for Android
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        position: 'absolute',
        top: 10,
        right: 10
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
    listContainer: {
        paddingBottom: 80 // Add space for the button
    },    
    errorText:{
        color: 'crimson',
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 6,
        textAlign: 'center'
    },
    errorContainer: {
        marginVertical: 8,
        alignItems: 'center'
    },
    errorAndButtonContainer: {
        paddingHorizontal: 16,
        paddingBottom: 96,
        backgroundColor: 'white', // Match your modal background
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        //paddingBottom: 96,
        //backgroundColor: 'white', // Match your modal background
    },
    cardContainer:{
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle:{        
        fontSize: 20,
        fontWeight: 'bold',
    },
    sectionHeader: {
        backgroundColor: '#f4f4f4',
        padding: 10,
        marginVertical: 5,
    },
    sectionHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
    }

});