interface KPIData {
  dau: number;
  mau: number;
  totalEnrollments: number;
  activeEnrollments: number;
  newEnrollments: number;
  completionRate: number;
  quizPassRate: number;
  assignmentBacklog: number;
  totalRevenue: number;
  refundRate: number;
  affiliateConversions: number;
}

interface Props {
  data: KPIData;
}

export function KPIDashboard({ data }: Props) {
  const metrics = [
    {
      name: "DAU / MAU",
      value: `${data.dau} / ${data.mau}`,
      change: data.mau > 0 ? `${Math.round((data.dau / data.mau) * 100)}% ratio` : "N/A",
      icon: "👥",
      color: "blue",
    },
    {
      name: "Active Enrollments",
      value: data.activeEnrollments.toLocaleString(),
      change: `${data.newEnrollments} new this month`,
      icon: "📚",
      color: "green",
    },
    {
      name: "Completion Rate",
      value: `${data.completionRate}%`,
      change: data.completionRate >= 70 ? "On track" : "Needs attention",
      icon: "✅",
      color: data.completionRate >= 70 ? "green" : "yellow",
    },
    {
      name: "Quiz Pass Rate",
      value: `${data.quizPassRate}%`,
      change: data.quizPassRate >= 70 ? "Good performance" : "Below target",
      icon: "📊",
      color: data.quizPassRate >= 70 ? "green" : "yellow",
    },
    {
      name: "Assignment Backlog",
      value: data.assignmentBacklog.toString(),
      change: data.assignmentBacklog > 50 ? "High" : "Normal",
      icon: "📝",
      color: data.assignmentBacklog > 50 ? "red" : "green",
    },
    {
      name: "Revenue (30d)",
      value: `$${data.totalRevenue.toLocaleString()}`,
      change: `${data.refundRate}% refund rate`,
      icon: "💰",
      color: "green",
    },
    {
      name: "Affiliate Conversions",
      value: data.affiliateConversions.toString(),
      change: "Last 30 days",
      icon: "🤝",
      color: "purple",
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{metric.icon}</span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  metric.color === "green"
                    ? "bg-green-100 text-green-800"
                    : metric.color === "yellow"
                    ? "bg-yellow-100 text-yellow-800"
                    : metric.color === "red"
                    ? "bg-red-100 text-red-800"
                    : metric.color === "purple"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {metric.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
  dau: number;
  mau: number;
  totalEnrollments: number;
  activeEnrollments: number;
  newEnrollments: number;
  completionRate: number;
  quizPassRate: number;
  assignmentBacklog: number;
  totalRevenue: number;
  refundRate: number;
  affiliateConversions: number;
}

interface Props {
  data: KPIData;
}

export function KPIDashboard({ data }: Props) {
  const metrics = [
    {
      name: "DAU / MAU",
      value: `${data.dau} / ${data.mau}`,
      change: data.mau > 0 ? `${Math.round((data.dau / data.mau) * 100)}% ratio` : "N/A",
      icon: "👥",
      color: "blue",
    },
    {
      name: "Active Enrollments",
      value: data.activeEnrollments.toLocaleString(),
      change: `${data.newEnrollments} new this month`,
      icon: "📚",
      color: "green",
    },
    {
      name: "Completion Rate",
      value: `${data.completionRate}%`,
      change: data.completionRate >= 70 ? "On track" : "Needs attention",
      icon: "✅",
      color: data.completionRate >= 70 ? "green" : "yellow",
    },
    {
      name: "Quiz Pass Rate",
      value: `${data.quizPassRate}%`,
      change: data.quizPassRate >= 70 ? "Good performance" : "Below target",
      icon: "📊",
      color: data.quizPassRate >= 70 ? "green" : "yellow",
    },
    {
      name: "Assignment Backlog",
      value: data.assignmentBacklog.toString(),
      change: data.assignmentBacklog > 50 ? "High" : "Normal",
      icon: "📝",
      color: data.assignmentBacklog > 50 ? "red" : "green",
    },
    {
      name: "Revenue (30d)",
      value: `$${data.totalRevenue.toLocaleString()}`,
      change: `${data.refundRate}% refund rate`,
      icon: "💰",
      color: "green",
    },
    {
      name: "Affiliate Conversions",
      value: data.affiliateConversions.toString(),
      change: "Last 30 days",
      icon: "🤝",
      color: "purple",
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{metric.icon}</span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  metric.color === "green"
                    ? "bg-green-100 text-green-800"
                    : metric.color === "yellow"
                    ? "bg-yellow-100 text-yellow-800"
                    : metric.color === "red"
                    ? "bg-red-100 text-red-800"
                    : metric.color === "purple"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {metric.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


