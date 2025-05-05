import React from "react";
import { Table, Button, Layout, Breadcrumb } from "antd";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Content } from "antd/es/layout/layout";
import { Navigate } from "react-router-dom";
import { translate } from "../../../components/utils/Translations";

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
                {/* Table Header */}
                <View style={[styles.tableRow, styles.headerRow]}>
                    <Text style={[styles.cell, styles.headerCell]}>Employee Name</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Department</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Performance</Text>
                </View>

                {/* Table Rows */}
                {employeeData.map((item, index) => (
                    <View
                        key={item.key}
                        style={[
                            styles.tableRow,
                            index % 2 === 0 ? styles.evenRow : styles.oddRow,
                        ]}
                    >
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
        <Layout>
            <Breadcrumb
                items={[{ title: <span onClick={() => Navigate("/dashboard")} style={{ cursor: "pointer", color: "#000" }}>{translate('home')}</span> }, { title: <span style={{ cursor: "pointer", color: "#3a3a3a" }}>{translate('jobs')}</span> }]}
                style={{ margin: "16px 0" }}
            />
            <Content
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    background: "#fff",
                    borderRadius: "8px",
                }}
            >
                <div style={{ padding: 20 }}>
                    <h2>Employee Performance Report</h2>

                    {/* Ant Design Table */}
                    <Table
                        columns={columns}
                        dataSource={employeeData}
                        pagination={false}
                        rowKey={(record) => record._id || record.username}
                        scroll={{ x: 'max-content' }}
                        components={{
                            body: {
                                cell: (props) => (
                                    <td {...props} style={{ paddingTop: "8px", paddingBottom: "8px" }} />
                                ),
                            },
                        }}
                    />

                    {/* PDF Download Link */}
                    <PDFDownloadLink document={<PDFDocument />} fileName="employee-performance-report.pdf">
                        {({ loading }) => (
                            <Button type="primary">{loading ? "Generating PDF..." : "Download PDF"}</Button>
                        )}
                    </PDFDownloadLink>
                </div>
            </Content>
        </Layout >
    );
};

export default PDFGenerator;
