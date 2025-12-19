import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  action: string;
  details?: any;
  createdAt: Date;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

interface Props {
  activities: Activity[];
}

export function RecentActivity({ activities }: Props) {
  const getActionIcon = (action: string) => {
    if (action.includes("login")) return "🔐";
    if (action.includes("payment")) return "💳";
    if (action.includes("role")) return "👤";
    if (action.includes("enrollment")) return "📚";
    if (action.includes("certificate")) return "🏆";
    return "📌";
  };

  const getActionColor = (action: string) => {
    if (action.includes("login")) return "text-blue-600";
    if (action.includes("payment")) return "text-green-600";
    if (action.includes("role")) return "text-purple-600";
    if (action.includes("error") || action.includes("fail")) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
              <span className="text-2xl mt-0.5">{getActionIcon(activity.action)}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${getActionColor(activity.action)}`}>
                  {activity.action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {activity.user.name || activity.user.email}
                </p>
                {activity.details && typeof activity.details === "object" && (
                  <p className="text-xs text-gray-500 mt-1">
                    {Object.entries(activity.details)
                      .slice(0, 2)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(", ")}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </span>
            </div>
          ))
        )}
      </div>
      <div className="mt-4">
        <a
          href="/admin/ops/audit"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View full audit log →
        </a>
      </div>
    </div>
  );
}

