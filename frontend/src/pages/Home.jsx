import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Chart from "chart.js/auto";
import "./Home.css";
import BranchDashboard from "../components/dash";
import BottomStats from "../components/BottomStats";
import Landing from "../components/Landing";
import Report from "../components/Report";

const Home = ({ shiftRight, show }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    dailyPatients: 0,
    medicineStock: 0,
    revenue: 0,
    feedback: 0,
  });

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
          {
            label: "Security Factor",
            data: [30, 50, 70, 40, 60],
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
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.1)" } },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className={`home ${shiftRight ? "shifted" : ""}`}>
      <div className="page-title">Current Data</div>

      <div>
        {location.pathname === "/statistics" ? (
          <BranchDashboard />
        ) : location.pathname === "/report" ? (
          <Report />
        ) : (
          <Landing setStats={setStats} />
        )}
      </div>

      <div className="divider"></div>

      <BottomStats stats={stats} />
    </div>
  );
};

export default Home;
