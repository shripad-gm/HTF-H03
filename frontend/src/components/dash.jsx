import { useState } from "react";
import "../components/Style/dash.css";
import DataChart from "./DataChart";

const options = [
  { name: "Unemployment Rate" },
  { name: "Literacy Rate" },
  { name: "Population Density" },
  { name: "Eviction Rate" },
];

function BranchDashboard() {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        {options.map((option, index) => (
          <div
            key={index}
            className={`dashboard-sidebar-item ${
              selectedOption.name === option.name ? "selected" : ""
            }`}
            onClick={() => setSelectedOption(option)}
          >
            {option.name}
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="dashboard-details">
        <h2>{selectedOption.name}</h2>
        <div className="dashboard-placeholder">
            <div className="dashboard-placeholder">
                  <DataChart type={selectedOption.name} />
            </div>
        </div>
      </div>
    </div>
  );
}

export default BranchDashboard;
