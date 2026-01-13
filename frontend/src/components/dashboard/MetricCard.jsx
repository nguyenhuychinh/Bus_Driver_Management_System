function MetricCard({ title, value, change, changeType, icon, gradient }) {
  const isPositive = changeType === 'positive';
  const changeClass = isPositive ? 'metric-change positive' : 'metric-change negative';

  return (
    <div className={`metric-card ${gradient || ''}`}>
      <div className="metric-header">
        <div className="metric-icon">{icon}</div>
        <div className="metric-title">{title}</div>
      </div>
      <div className="metric-body">
        <div className="metric-value">{value}</div>
        {change && (
          <div className={changeClass}>
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MetricCard;
