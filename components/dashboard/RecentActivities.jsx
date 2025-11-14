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
    <div className="space-y-2 sm:space-y-3">
      {displayActivities.slice(0, 5).map((activity, index) => {
        const Icon = activityIcons[activity.type] || activityIcons.default;
        const colorClass = activityColors[activity.type] || activityColors.default;
        
        return (
          <div 
            key={activity.id} 
            className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-all duration-200 group cursor-pointer active:scale-[0.98]"
          >
            {/* Icon Container */}
            <div className={`p-1.5 sm:p-2 rounded-lg ${colorClass} group-hover:scale-105 transition-transform duration-200 shrink-0 mt-0.5`}>
              <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1">
              {/* Title and Date Row */}
              <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-1 xs:gap-2">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate leading-tight">
                  {activity.title}
                </p>
                <span className="text-[10px] xs:text-xs text-gray-400 whitespace-nowrap flex items-center gap-1 shrink-0">
                  <Calendar className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
                  {formatDistanceToNow(new Date(activity.timestamp), { 
                    addSuffix: true,
                    includeSeconds: false 
                  }).replace('about ', '').replace(' minutes', 'min')}
                </span>
              </div>
              
              {/* Description */}
              <p className="text-[10px] xs:text-xs text-gray-500 leading-relaxed line-clamp-2">
                {activity.description}
              </p>
            </div>

            {/* Connection line for timeline effect - Hidden on mobile, visible on sm+ */}
            {index < displayActivities.length - 1 && (
              <div className="hidden sm:block absolute left-5 sm:left-6 top-10 sm:top-12 w-0.5 h-6 sm:h-8 bg-gray-200 -z-10"></div>
            )}
          </div>
        );
      })}

      {/* Empty State for Mobile */}
      {displayActivities.length === 0 && (
        <div className="text-center py-6 sm:py-8">
          <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
          <p className="text-xs sm:text-sm text-gray-500 px-2">
            No recent activities to display
          </p>
        </div>
      )}
    </div>
  );
}