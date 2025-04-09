import { RefreshCcw, Users, PackageCheck, DollarSign, MessageCircle } from "lucide-react";
import "./Style/BottomStats.css";

const iconMap = {
  dailyPatients: <Users className="stat-icon" />,
  medicineStock: <PackageCheck className="stat-icon" />,
  revenue: <DollarSign className="stat-icon" />,
  feedback: <MessageCircle className="stat-icon" />,
};

const titles = {
  dailyPatients: "Daily Patients",
  medicineStock: "Beds Required",
  revenue: "Expenditure",
  feedback: "Doctors Needed",
};

function BottomStats({ stats }) {
  const loading = !stats || Object.keys(stats).length === 0;

  const statsKeys = ["dailyPatients", "medicineStock", "revenue", "feedback"];

  return (
    <div className="bottom-stats-container">
      <div className="bottom-stats-grid">
        {statsKeys.map((key) => (
          <div key={key} className="stat-card">
            <div className="stat-header">
              <span>{titles[key]}</span>
              {iconMap[key]}
            </div>
            <div className="stat-value">
              {loading ? (
                <RefreshCcw className="loading-spinner" />
              ) : key === "revenue" ? (
                `₹${stats[key].toLocaleString()}`
              ) : (
                stats[key]
              )}
            </div>
            <div className="stat-footer">Updated every 5 sec</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BottomStats;
