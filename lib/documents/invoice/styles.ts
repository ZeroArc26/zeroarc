import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#000",
    backgroundColor: "#FFFFFF",
  },

  // Header
  header: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#D4D4D8",
    paddingBottom: 12,
  },

  companyName: {
    fontSize: 20,
    fontWeight: "bold",
  },

  invoiceTitle: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "bold",
  },

  companyInfo: {
    marginTop: 6,
    fontSize: 9,
    color: "#52525B",
    lineHeight: 1.5,
  },

  // Sections

  section: {
    marginTop: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },

  column: {
    flex: 1,
  },

  heading: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
  },

  text: {
    fontSize: 10,
    marginBottom: 4,
  },

  // Table

  table: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#D4D4D8",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F4F4F5",
    borderBottomWidth: 1,
    borderBottomColor: "#D4D4D8",
    paddingVertical: 8,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
    paddingVertical: 8,
  },

  cell: {
    flex: 1,
    paddingHorizontal: 6,
    fontSize: 9,
  },

  // Summary

  summary: {
    marginTop: 18,
    alignSelf: "flex-end",
    width: 220,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  total: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#000",
    fontWeight: "bold",
    fontSize: 11,
  },

  // Footer

  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#D4D4D8",
    paddingTop: 12,
    fontSize: 9,
    textAlign: "center",
    color: "#52525B",
  },
});