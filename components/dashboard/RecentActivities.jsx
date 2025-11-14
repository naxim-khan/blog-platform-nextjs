import { formatDistanceToNow } from "date-fns";
import { FileText, Edit, Plus, CheckCircle, Eye, Calendar } from "lucide-react";

const activityIcons = {
  created: Plus,
  updated: Edit,
  published: CheckCircle,
  viewed: Eye,
  default: FileText
};

const activityColors = {
  created: "text-blue-600 bg-blue-50 border border-blue-100",
  updated: "text-amber-600 bg-amber-50 border border-amber-100",
  published: "text-green-600 bg-green-50 border border-green-100",
  viewed: "text-purple-600 bg-purple-50 border border-purple-100",
  default: "text-gray-600 bg-gray-50 border border-gray-100"
};

export default function RecentActivities({ activities }) {
  const defaultActivities = [
    {
      id: 1,
      type: 'created',
      title: 'Welcome to BlogCMS',
      timestamp: new Date(),
      description: 'Your blogging journey starts here'
    },
    {
      id: 2,
      type: 'published',
      title: 'First Post Published',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      description: 'Your content is now live'
    },
    {
      id: 3,
      type: 'viewed',
      title: 'Post Getting Views',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      description: 'Readers are engaging with your content'
    }
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="space-y-3">
      {displayActivities.slice(0, 5).map((activity, index) => {
        const Icon = activityIcons[activity.type] || activityIcons.default;
        const colorClass = activityColors[activity.type] || activityColors.default;
        
        return (
          <div 
            key={activity.id} 
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-all duration-200 group cursor-pointer"
          >
            <div className={`p-2 rounded-lg ${colorClass} group-hover:scale-105 transition-transform duration-200 shrink-0`}>
              <Icon className="h-4 w-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {activity.description}
              </p>
            </div>

            {/* Connection line for timeline effect */}
            {index < displayActivities.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200 -z-10"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}