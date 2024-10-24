import React, { useState, useEffect } from "react";
import { getReportLogs } from "../api/ReportAPI";
import "./Reports.css";

function Reports() {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(6);

  useEffect(() => {
    async function fetchReport() {
      try {
        const report = await getReportLogs();
        setReports(report);
      } catch (error) {
        console.error("Error Fetching the reports", error);
      }
    }

    fetchReport();
  }, []);

  async function handleFilter(event) {
    const searchValue = event.target.value.toLowerCase();
    try {
      const allReports = await getReportLogs();
      const filteredReports = allReports.filter((report) => {
        const reportID = report._id.toLowerCase();
        const reportType = report.eventType.toLowerCase();
        const reportUsername = report.username.toLowerCase();
        const reportDate = formatDate(report.timestamp).toLowerCase();

        return (
          reportID.includes(searchValue) ||
          reportType.includes(searchValue) ||
          reportUsername.includes(searchValue) ||
          reportDate.includes(searchValue)
        );
      });
      setReports(filteredReports);
    } catch (error) {
      console.error("Error Filtering the reports", error);
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

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(reports.length / reportsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="report-table">
      <h2 className="h2-report">Reports</h2>
      <input
        type="text"
        onChange={handleFilter}
        className="search-function-report"
        placeholder="Search by name"
      />
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
          {currentReports.map((row, index) => (
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
      
      <nav className="pagination-nav">
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Reports;
