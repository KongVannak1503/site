import React from "react";
import { Table, Button } from "antd";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Shared employee data
const employeeData = [
    { key: "1", name: "John Doe", department: "IT", performance: "Excellent" },
    { key: "2", name: "Jane Smith", department: "HR", performance: "Good" },
    { key: "3", name: "Alice Johnson", department: "Finance", performance: "Average" },
];

// AntD table columns
const columns = [
    { title: "Employee Name", dataIndex: "name", key: "name" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Performance", dataIndex: "performance", key: "performance" },
];

// PDF styles
const styles = StyleSheet.create({
    page: { padding: 20 },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    table: { display: "table", width: "100%" },
    tableRow: { flexDirection: "row", borderBottom: "1px solid #ccc" },
    headerCell: { fontWeight: "bold", backgroundColor: "#eee", padding: 5, width: "33.33%", fontSize: 12 },
    cell: { padding: 5, width: "33.33%", fontSize: 12 },
});

// PDF Document component
const PDFDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Employee Performance Report</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <Text style={styles.headerCell}>Employee Name</Text>
                    <Text style={styles.headerCell}>Department</Text>
                    <Text style={styles.headerCell}>Performance</Text>
                </View>
                {employeeData.map((item) => (
                    <View style={styles.tableRow} key={item.key}>
                        <Text style={styles.cell}>{item.name}</Text>
                        <Text style={styles.cell}>{item.department}</Text>
                        <Text style={styles.cell}>{item.performance}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

// Main component
const PDFGenerator = () => {
    return (
        <div style={{ padding: 20 }}>
            <h2>Employee Performance Report</h2>

            {/* Ant Design Table */}
            <Table
                columns={columns}
                dataSource={employeeData}
                pagination={false}
                bordered
                style={{ marginBottom: 20 }}
            />

            {/* PDF Download Link */}
            <PDFDownloadLink document={<PDFDocument />} fileName="employee-performance-report.pdf">
                {({ loading }) => (
                    <Button type="primary">{loading ? "Generating PDF..." : "Download PDF"}</Button>
                )}
            </PDFDownloadLink>
        </div>
    );
};

export default PDFGenerator;
