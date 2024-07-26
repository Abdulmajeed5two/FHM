import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [reportType, setReportType] = useState('pdf');
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('/api/reports/checked-out'); 
        console.log('Fetched reports:', response.data); 
        if (Array.isArray(response.data)) {
          setReports(response.data);
        } else {
          console.error('Expected an array of reports, but got:', response.data);
          setReports([]);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
        setReports([]); 
      }
    };

    fetchReports();
  }, []);

  const handleDownload = () => {
    console.log(`Downloading ${reportPeriod} report in ${reportType} format.`);
  };

  return (
    <div className="mt-24 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl mb-4 text-center">Reports</h2>
      <p className="mb-6 text-center">Here you can view and download various reports.</p>
      <div className="flex flex-col items-center">
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl mb-4 text-center">Generated Reports</h3>
          <div className="flex space-x-4">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
                Select Report Type
              </label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
              </select>
            </div>
            <div>
              <label htmlFor="reportPeriod" className="block text-sm font-medium text-gray-700">
                Select Report Period
              </label>
              <select
                id="reportPeriod"
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <button
              onClick={handleDownload}
              className="self-end bg-red-500 text-white py-2 px-4 rounded transition duration-300 hover:bg-red-700 mt-6"
            >
              Download
            </button>
          </div>
        </div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">Room Number</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">User Name</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">Check-In Date</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">Check-Out Date</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">Amount</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">Download</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(reports) && reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report._id}>
                  <td className="py-2 px-4 border-b border-gray-200">{report.roomNo}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{report.userName}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{new Date(report.checkInDate).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{new Date(report.checkOutDate).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{report.amount}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button className="bg-red-500 text-white py-1 px-2 rounded transition duration-300 hover:bg-red-700">
                      Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-2 px-4 border-b border-gray-200 text-center">No reports found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
