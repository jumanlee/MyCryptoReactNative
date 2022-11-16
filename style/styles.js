import {StyleSheet} from 'react-native'

const styles=StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgba(221,160,221,0.5)',
        justifyContent: 'center',
      },
  
      titleContainer: {
          marginLeft: '5%',
          marginRight: '5%',
          marginBottom: '2%',
          marginTop: '2%',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
      },
  
      titleText:{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#696969',
      },
  
      inputField: {
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          borderRadius: 20,
          margin: '5%',
          padding: '2%',
          width: '70%',
          borderWidth: 2,
          borderColor: '#E6E6FA',
      },
  
      lastRefreshed:{
          fontSize: 13,
          color: '#696969',
          marginLeft: '5%',
          marginRight: '5%',
          marginBottom: '2%',
          marginTop: '2%',
      },
  
      deleteAllContainer:{
          backgroundColor: 'rgba(75,0,130, 0.5)',
          width: '38%',
          paddingRight: '5%',
          paddingLeft: '5%',
          paddingTop: '2%',
          paddingBottom: '2%',
          marginLeft: '5%',
          marginTop: '2%',
          borderRadius: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
      },
  
      swipeContainer:{
          backgroundColor: 'red',
          paddingLeft: '3%',
          paddingRight: '3%',
          marginTop: '1%',
          marginRight: '0%',
          marginLeft: '1%',
          marginBottom: '2%',
          borderRadius: 10,
          flexDirection: 'column',
          justifyContent: 'center',
  
      },
  
      swipeText: {
          fontWeight: 'bold',
          color: 'white',
      },
  
      deleteAllText:{
          color: '#DCDCDC',
          textAlign: 'center',
      },
  
      cell: {
          backgroundColor: 'white',
          width: '90%',
          marginRight: '5%',
          marginLeft: '5%',
          marginTop: '1%',
          marginBottom: '2%',
          padding: '4%',
          borderRadius: 10,
          borderColor: '#E6E6FA',
      },
  
      cellItem: {
          flexDirection: 'row', 
          justifyContent: 'flex-start', 
          alignItems: 'center',
      },
  
      boldText: {
          fontWeight: 'bold',
          color: '#800080',
      },
  
      image: {
          height: 150, 
          width: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          marginBottom: '2%',
      },

      popupContainer: {
        height: '100%', 
        width: '100%', 
        backgroundColor: 'rgba(	93, 84, 164, 0.8)',
      },

      popup:{
        borderWidth: 3,
        borderColor: 'rgba(75,0,130, 0.5)',
        paddingBottom: '8%',
        width: '80%', 
        backgroundColor: 'rgba(255,255,255,0.8)',
        marginTop: '50%',
        marginBottom: '40%',
        marginLeft: '10%',
        marginRight: '10%',
        borderRadius: 20,
      },


      popupX:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: '10%',
        marginRight: '10%',
        marginTop: '8%',

      },

      popupXText:{
          fontWeight: 'bold',
          fontSize: 15,
          paddingTop: '0%',
          paddingRight: '5%',
          paddingLeft: '5%',
          paddingBottom: '5%',

      },
      
      popupButtonContainer:{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: '18%',
      },

      popupButton: {
          backgroundColor: 'rgba(75,0,130, 0.5)',
          paddingRight: '7%',
          paddingLeft: '7%',
          paddingTop: '3%',
          paddingBottom: '3%',
          borderRadius: 10,
      },

      popupButtonText: {
        color: '#DCDCDC',
        textAlign: 'center',
      },

      popupInputTitle: {
        marginTop: '3%',
        marginLeft: '5%'
      },

      popupInputContainer: {
        backgroundColor: '#D8BFD8',
        paddingBottom: '2%',
        paddingTop: '2%',
        paddingBottom: '3%'
      },

      popupInput: {
        width: '50%',
        backgroundColor: '#E6E6FA',
        marginLeft: '5%',
        marginTop: '2%',
        marginBottom: '2%',
        paddingTop: '2.5%',
        paddingLeft: '2.5%',
        paddingBottom: '2.5%',
        borderRadius: 10,
        color: 'grey',
      },

      popupBack: {
        marginTop: '5%',
        marginBottom: '5%',
        backgroundColor: 'rgba(75,0,130, 0.5)',
        paddingRight: '7%',
        paddingLeft: '7%',
        paddingTop: '3%',
        paddingBottom: '3%',
        borderRadius: 10,
        width: '35%',
        flexDirection: 'row',
        justifyContent: 'center',
      },

      popupBackText: {
          textAlign: 'center',
          color: '#DCDCDC',
      },

      walletContainer: {
        flex: 1,
        height: '100%',
        marginTop: '3%',

      },

      reset: {
        marginTop: '5%',
        marginBottom: '1%',
        marginLeft: '5%',
        backgroundColor: 'rgba(75,0,130, 0.5)',
        paddingRight: '7%',
        paddingLeft: '5%',
        paddingTop: '3%',
        paddingBottom: '3%',
        borderRadius: 10,
        width: '30%',
        flexDirection: 'row',
        justifyContent: 'center',

      }
})

export default styles;