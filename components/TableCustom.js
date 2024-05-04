import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { onValue, ref } from '@firebase/database';
import { db } from '../utils/firebase';

const TableCustom = () => {
    const [tableData, setTableData] = useState({ tableHead: ['ProductID', 'Status', 'Last Updated'], tableData: [] });

    const userID = localStorage.getItem('userID');
    const productID = localStorage.getItem('ProductID');
    useEffect(() => {
        const fetchData = () => {
            const userRef = ref(db, `User/${userID}`);
            onValue(userRef, (snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                    const tableRows = [[productID, 'Online', '12/05/2024']]; // Hard code 'Online' and '12/05/2024'
                    setTableData(prevState => ({ ...prevState, tableData: tableRows }));
                }
            });
        };

        fetchData();

        return () => {
            // Clean up
        };
    }, []);

    return (
        <View style={styles.container}>
            <Table style={styles.table} borderStyle={{ borderWidth: 1, borderColor: '#ccc' }}>
                <Row data={tableData.tableHead} style={styles.head} textStyle={styles.headText} />
                <Rows data={tableData.tableData} textStyle={styles.text} />
            </Table>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    table: { width: '100%' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    headText: { fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
    text: { textAlign: 'center', fontSize: 14 },
});

export default TableCustom;