// Predictive Card Component
function PredictiveCard({ title, current, predicted, unit, description, trend, timeframe }: PredictiveCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <ArrowUp className={`h-4 w-4 ${predicted > current ? "text-emerald-500" : "text-red-500"}`} />;
      case "down":
        return <ArrowDown className={`h-4 w-4 ${predicted < current ? "text-emerald-500" : "text-red-500"}`} />;
      case "stable":
        return <MinusIcon className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };
  
  const getChangePercentage = () => {
    const change = ((predicted - current) / current) * 100;
    return change.toFixed(1);
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <div className="flex items-baseline mt-1">
            <h3 className="text-2xl font-bold">{predicted.toLocaleString()}</h3>
            <span className="ml-1 text-sm">{unit}</span>
          </div>
          <div className="flex items-center mt-2">
            {getTrendIcon()}
            <span className={`ml-1 text-sm font-medium ${
              trend === "up" ? 
                (predicted > current ? "text-emerald-500" : "text-red-500") : 
              trend === "down" ? 
                (predicted < current ? "text-emerald-500" : "text-red-500") : 
                "text-blue-500"
            }`}>
              {Math.abs(Number(getChangePercentage()))}% {trend}
            </span>
            <span className="ml-1 text-sm text-gray-500">in {timeframe}</span>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">{description}</div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs">Current: {current.toLocaleString()} {unit}</span>
              <ArrowRight className="h-3 w-3 text-gray-400" />
              <span className="text-xs">Predicted: {predicted.toLocaleString()} {unit}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default RealSTPDashboard;