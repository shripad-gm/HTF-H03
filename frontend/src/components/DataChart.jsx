import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DataChart({ type }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [parsedData, setParsedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const BASE_URL = "http://127.0.0.1:5000";
        const response = await axios.get(`${BASE_URL}/get_data`, {
          params: {
            zip_code: "560001",
          },
        });
        console.log("Fetched Data:", response.data);
        setParsedData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (parsedData.length === 0) return;

    const ctx = canvasRef.current.getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const chartConfigs = {
      "Unemployment Rate": {
        labels: parsedData.map(item => item.month),
        data: parsedData.map(item => item.UnemploymentRate),
      },
      "Literacy Rate": {
        labels: parsedData.map(item => item.month),
        data: parsedData.map(item => item.LiteracyRate),
      },
      "Population Density": {
        labels: parsedData.map(item => item.month),
        data: parsedData.map(item => item.PopulationDensity),
      },
      "Eviction Rate": {
        labels: parsedData.map(item => item.month),
        data: parsedData.map(item => item.EvictionRate),
      },
    };

    const config = chartConfigs[type];

    chartRef.current = new ChartJS(ctx, {
      type: "bar",
      data: {
        labels: config.labels,
        datasets: [
          {
            label: type,
            data: config.data,
            backgroundColor: "#fab005",
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: `${type} (Monthly)` },
        },
        scales: {
          y: {
            ticks: { color: "#fff" },
          },
          x: {
            ticks: { color: "#fff" },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [type, parsedData]);

  return <canvas ref={canvasRef} />;
}

export default DataChart;
