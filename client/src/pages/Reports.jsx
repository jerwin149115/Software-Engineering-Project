import React, {useState, useEffect} from "react";
import { getReportLogs } from "../api/ReportAPI";
import "./Reports.css"; 

function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchReport() {
      try {
        const report = await getReportLogs();
        setReports(report);
      } catch (error) {
        console.error('Error Fetching the reports', error);
      }
    }

    fetchReport();
  }, [])

  async function handleFilter(event) {
    const searchValue = event.target.value.toLowerCase();
    try {
      const allReports = await getReportLogs(); // Get all reports, no need to filter from API directly
      const filteredReports = allReports.filter(report => {
        const reportID = report._id.toLowerCase();
        const reportType = report.eventType.toLowerCase();
        const reportUsername = report.username.toLowerCase();
        const reportDate = formatDate(report.timestamp).toLowerCase();
  
        // Check if the search value matches any of the fields
        return (
          reportID.includes(searchValue) ||
          reportType.includes(searchValue) ||
          reportUsername.includes(searchValue) ||
          reportDate.includes(searchValue)
        );
      });
      setReports(filteredReports);
    } catch (error) {
      console.error('Error Filtering the reports', error);
    }
  }
  

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return (
    <div className="report-table">
      <h2 className="h2-report">Reports</h2>
      <input type="text" onChange={handleFilter} className="search-function-report" placeholder="Search by name" />
      <table className="table-report">
        <thead className="thead-report">
          <tr className="tr-report">
            <th className="th-report">Report ID</th>
            <th className="th-report">Type</th>
            <th className="th-report">Username</th>
            <th className="th-report">Remarks</th>
            <th className="th-report">Date</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((row, index) => (
            <tr className="tr-report" key={index}>
              <td className="td-report">{row._id}</td>
              <td className="td-report">{row.eventType}</td>
              <td className="td-report">{row.username}</td>
              <td className="td-report">{row.remarks}</td>
              <td className="td-report">{formatDate(row.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
