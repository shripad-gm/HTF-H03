import { useState } from "react";
import "../components/Style/report.css";
import axios from "axios";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

function Report() {
  const [zipCode, setZipCode] = useState("560001");
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/generate_report?zip_code=${zipCode}`
      );
      setReportText(response.data.report);
    } catch (err) {
      setError("Failed to fetch report. Check backend or ZIP code.");
    } finally {
      setLoading(false);
    }
  };

  const formatReportText = (text) => {
    let formatted = text;

    // Make **text** bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Style section titles
    formatted = formatted.replace(
      /(Executive Summary:|Current Hospital Bed Requirement Estimation:|ER Surge Prediction for the next 2-3 weeks:|Accuracy Check and Confidence based on ER Spike Factor:|Observations on SDoH factors contributing to the surge:|Suggestions to Hospitals and Healthcare Administrators:)/g,
      (match) => `<span class="section-heading">${match}</span>`
    );

    return formatted
      .split(/\n\s*\n/)
      .map((para) => `<p>${para.trim()}</p>`)
      .join("");
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    const lineHeight = 8;
    let y = 20;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 119, 204);
    doc.text("Healthcare Risk Analysis Report", 15, y);
    y += lineHeight + 4;

    const paragraphs = reportText.split(/\n\s*\n/);
    paragraphs.forEach((paragraph) => {
      const isHeading = paragraph.match(
        /Executive Summary:|Current Hospital Bed Requirement Estimation:|ER Surge Prediction for the next 2-3 weeks:|Accuracy Check and Confidence based on ER Spike Factor:|Observations on SDoH factors contributing to the surge:|Suggestions to Hospitals and Healthcare Administrators:/
      );

      if (isHeading) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(0, 86, 179);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(0);
      }

      const cleanParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, "$1");
      const lines = doc.splitTextToSize(cleanParagraph, 180);
      doc.text(lines, 15, y);
      y += lines.length * lineHeight + 2;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`healthcare_report_${zipCode}.pdf`);
  };

  const downloadAsDOCX = () => {
    const htmlFormatted = formatReportText(reportText);
    const fullHtml = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              line-height: 1.5;
              font-size: 16px;
              color: #333;
            }
            strong {
              font-weight: bold;
              color: #000;
            }
            .section-heading {
              color: #0056b3;
              text-decoration: underline;
              font-weight: 600;
              font-size: 17px;
              margin-top: 20px;
              display: block;
            }
          </style>
        </head>
        <body>
          <h2 style="color:#0077cc">Healthcare Risk Analysis Report</h2>
          ${htmlFormatted}
        </body>
      </html>
    `;

    const blob = new Blob([fullHtml], { type: "application/msword" });
    saveAs(blob, `healthcare_report_${zipCode}.doc`);
  };

  return (
    <div className="report-container">
      <h2 className="report-title">Generate Healthcare Report</h2>
      <div className="report-input">
        <input
          type="text"
          placeholder="Enter ZIP code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        />
        <button onClick={fetchReport}>Generate</button>
      </div>

      {loading && <p>Loading report...</p>}
      {error && <p className="error">{error}</p>}

      {reportText && (
        <div className="report-output">
          <h3 className="report-subtitle">Report for ZIP: {zipCode}</h3>
          <div
            className="report-content"
            dangerouslySetInnerHTML={{ __html: formatReportText(reportText) }}
          />
          <div className="download-buttons">
            <button onClick={downloadAsPDF}>Download PDF</button>
            <button onClick={downloadAsDOCX}>Download DOCX</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Report;
