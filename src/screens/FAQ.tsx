import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Switch,
} from 'react-native';
import colors from '../styles/colors';


export default function FAQs() {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
            <ScrollView contentContainerStyle={styles.containter}>
                <Text style={styles.heading}>자주 물어보는 질문</Text>

                <Text style={styles.question}>
                    Q: What is the app about?
                </Text>
                <Text style={styles.answer}>
                    A: The app helps users find nearby restaurants and provides reviews and ratings from other users.
                </Text>
                <Text style={styles.question}>
                    Q: What is the app about?
                </Text>
                <Text style={styles.answer}>
                    A: The app helps users find nearby restaurants and provides reviews and ratings from other users.
                </Text>
                <Text style={styles.question}>
                    Q: What is the app about?
                </Text>
                <Text style={styles.answer}>
                    A: The app helps users find nearby restaurants and provides reviews and ratings from other users.
                </Text>
                <Text style={styles.question}>
                    Q: What is the app about?
                </Text>
                <Text style={styles.answer}>
                    A: The app helps users find nearby restaurants and provides reviews and ratings from other users.
                </Text>
                <Text style={styles.question}>
                    Q: What is the app about?
                </Text>
                <Text style={styles.answer}>
                    A: The app helps users find nearby restaurants and provides reviews and ratings from other users.
                </Text>
                <Text style={styles.question}>
                    Q: What is the app about?
                </Text>
                <Text style={styles.answer}>
                    A: The app helps users find nearby restaurants and provides reviews and ratings from other users.
                </Text>
                <Text style={styles.question}>
                    Q: What is the app about?
                </Text>
                <Text style={styles.answer}>
                    A: The app helps users find nearby restaurants and provides reviews and ratings from other users.
                </Text>
                <Text style={styles.question}>
                    Q: What is the app about?
                </Text>
                <Text style={styles.answer}>
                    A: The app helps users find nearby restaurants and provides reviews and ratings from other users.
                </Text>
               

            </ScrollView>
        </SafeAreaView>
    )    
}
const styles = StyleSheet.create({
    containter: {
      paddingVertical: 24,
    },
    heading: {
      fontSize: 30,
      fontWeight: 'bold',
      color: colors.coral1,
      marginBottom: 35,
      textAlign: 'left',
      paddingHorizontal: 24,
    },
    question: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20,
        textAlign: 'left',
        paddingHorizontal: 24,
    },
    answer: {
        fontSize: 17,
        color: 'black',
        marginBottom: 20,
        textAlign: 'left',
        paddingHorizontal: 24,
    },
    section: {
      paddingHorizontal: 24,
    },
    sectionHeader: {
      paddingVertical: 12,
      fontSize: 15,
      fontWeight: 'bold',
      color: 'white',
      textTransform: 'uppercase',
      letterSpacing: 1.1,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: 50,
      backgroundColor: '#f2f2f2f2',
      borderRadius: 8,
      marginBottom: 8,
      paddingHorizontal: 12,
    },
    rowText: {
      fontSize: 17,
      color: '#0c0c0c',
    },
});