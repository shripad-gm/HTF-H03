import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import "../pages/Home.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Landing({ setStats }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const pieRef = useRef(null);
  const pieInstanceRef = useRef(null);
  const navigate = useNavigate();

  const [zipCode, setZipCode] = useState("560001");
  const [bedsAvailable, setBedsAvailable] = useState(120);
  const [reportData, setReportData] = useState(null);
  const [bedRequired, setBedRequired] = useState(150);
  const [doctors, setDoctors] = useState(10);
  const [expenditure, setExpenditure] = useState(500000);
  const [patientsExpected, setPatientsExpected] = useState(230);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/get_data', {
          params: { zip_code: zipCode },
        });

        const parsedData = response.data;
        const val1 = parsedData[0].ERSpikeFactor;
        const val2 = parsedData[1].ERSpikeFactor;
        const val3 = parsedData[2].ERSpikeFactor;
        const val4 = parsedData[3].ERSpikeFactor;

        const ctx = chartRef.current.getContext("2d");

        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May"],
            datasets: [
              {
                label: "ER Factor",
                data: [val1, val2, val3, val4, val1],
                backgroundColor: "#fab005",
                borderRadius: 10,
                barPercentage: 0.4,
                categoryPercentage: 0.5,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: { grid: { display: false } },
              y: {
                beginAtZero: true,
                min: 1,
                max: 1.4,
                grid: {
                  color: "rgba(255,255,255,0.1)",
                },
              },
            },
          },
        });

        const pieCtx = pieRef.current.getContext("2d");
        if (pieInstanceRef.current) {
          pieInstanceRef.current.destroy();
        }

        const crime = parsedData[0].CrimeRate;
        const eviction = parsedData[0].EvictionRate;
        const literacy = parsedData[0].LiteracyRate;
        const absentee = parsedData[0].SchoolAbsenteeismRate;
        const unemployment = parsedData[0].UnemploymentRate;
        const weather = parsedData[0].WeatherSeverityIndex;

        const rawValues = [
          unemployment,
          eviction,
          literacy,
          absentee,
          crime,
          weather
        ];

        const total = rawValues.reduce((sum, val) => sum + val, 0);
        const percentages = rawValues.map(val => (val / total) * 100);

        pieInstanceRef.current = new Chart(pieCtx, {
          type: "pie",
          data: {
            labels: [
              "Unemployment Rate",
              "Eviction Rate",
              "Literacy Rate",
              "Absentee Rate to Educational Institutes",
              "Crime Rate",
              "Weather Severity"
            ],
            datasets: [
              {
                data: percentages,
                backgroundColor: [
                  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728",
                  "#9467bd", "#8c564b", "#e377c2"
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color: "#fff",
                  padding: 15,
                },
              },
            },
          },
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      if (pieInstanceRef.current) {
        pieInstanceRef.current.destroy();
      }
    };
  }, [zipCode]);

  const handleClick = () => {
    navigate('/statistics');
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:5000/generate_report?zip_code=${zipCode}`);
      const report = res.data.report.replace(/Date:.*\n?/g, "");
      setReportData(report);

      const numbers = report.match(/\d+/g)?.map(Number) || [];
      const bedReq = numbers.find(n => n > 50 && n < 1000) || 150;
      const docs = Math.ceil(bedReq / 10);
      const expend = docs * 50000;
      const patients = Math.floor(bedReq * 1.5);

      setBedRequired(bedReq);
      setDoctors(docs);
      setExpenditure(expend);
      setPatientsExpected(patients);

      if (setStats) {
        setStats({
          dailyPatients: patients,
          medicineStock: bedReq,
          revenue: expend,
          feedback: docs
        });
      }
    } catch (err) {
      console.error("Failed to fetch report", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <div style={{ padding: "1rem 2rem 0.5rem", display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input
            type="text"
            placeholder="ZIP Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none"
            }}
          />
          <input
            type="number"
            placeholder="Beds Available"
            value={bedsAvailable}
            onChange={(e) => setBedsAvailable(Number(e.target.value))}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none"
            }}
          />
          <button
            onClick={generateReport}
            style={{
              backgroundColor: "#fab005",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Generate
          </button>
          {loading && (
            <div className="custom-spinner">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}
        </div>

        <div className="section">
          <div
            className="top-left"
            onClick={handleClick}
            style={{ cursor: "pointer", height: "250px", padding: "10px" }}
          >
            <canvas
              ref={chartRef}
              style={{ width: "100%", height: "100%" }}
            ></canvas>
          </div>

          <div className="top-right">
            <h3 style={{ color: "#fab005" }}>Hospital Performance</h3>
            <p>
              {reportData
                ? `Expand emergency capacity by ${doctors * 3} sqm, deploy ${doctors} additional staff, and prepare for ${patientsExpected} incoming patients.`
                : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis egestas rhoncus."}
            </p>
          </div>
        </div>

        <div className="section">
          <div className="middle-left glass-box">
            <p>Status: <span style={{ color: bedRequired > bedsAvailable ? "red" : "green", fontSize: "18px", fontWeight: "bolder" }}>{bedRequired > bedsAvailable ? "Deficient" : "Sufficient"}</span></p>
            <p>No of beds required: {bedRequired}</p>
            <p>No of beds available: {bedsAvailable}</p>
          </div>
          <div className="middle-right info-box">
            <h4 style={{ color: "#fab005" }}>Expenditure & Finance</h4>
            <p>No of doctors required: <span style={{ color: " rgb(250, 176, 5)" }}>{doctors}</span></p>
            <p>Total expenditure on doctors: <span style={{ color: " rgb(250, 176, 5)" }}>₹{expenditure.toLocaleString()}</span></p>
            <p>No of patients expected: <span style={{ color: " rgb(250, 176, 5)" }}>{patientsExpected}</span></p>
          </div>
        </div>
      </div>

      {/* Pie Chart Section */}
      <div
        style={{
          width: "450px",
          marginLeft: "-20px",
          marginRight: "11rem",
          marginTop: "-1rem",
          backgroundColor: "#2a2a2a",
          borderRadius: "20px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h4 style={{ color: "#fff", textAlign: "center", marginBottom: "10px" }}>
          SDoH Insights
        </h4>
        <div style={{ flex: 1 }}>
          <canvas
            ref={pieRef}
            style={{ width: "100%", height: "100%" }}
          ></canvas>
        </div>
      </div>

      <style>{`
        .custom-spinner {
          display: flex;
          gap: 5px;
        }
        .custom-spinner .dot {
          width: 10px;
          height: 10px;
          background-color: #fab005;
          border-radius: 50%;
          animation: bounce 0.6s infinite alternate;
        }
        .custom-spinner .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .custom-spinner .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes bounce {
          from { transform: translateY(0); opacity: 0.6; }
          to { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default Landing;
