import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye, CheckCircle, Clock } from "lucide-react";

const statConfig = {
  totalPosts: {
    label: "Posts",
    shortLabel: "Posts",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border border-blue-100",
    trend: "+12%"
  },
  published: {
    label: "Published",
    shortLabel: "Live",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 border border-green-100",
    trend: "+8%"
  },
  drafts: {
    label: "Drafts",
    shortLabel: "Drafts",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50 border border-amber-100",
    trend: "-2%"
  },
  totalViews: {
    label: "Total Views",
    shortLabel: "Views",
    icon: Eye,
    color: "text-purple-600",
    bgColor: "bg-purple-50 border border-purple-100",
    trend: "+24%"
  }
};

export default function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
      {Object.entries(statConfig).map(([key, config]) => {
        const Icon = config.icon;
        const value = stats[key] || 0;
        
        return (
          <Card key={key} className="border border-gray-200 shadow-xs hover:shadow-sm transition-all duration-200 bg-white overflow-hidden group active:scale-[0.98]">
            <CardContent className="p-1.5 xs:p-2 sm:p-3 md:p-4">
              <div className="flex items-center justify-between">
                {/* Content - Left side */}
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5 truncate hidden xs:block">
                    {config.label}
                  </p>
                  <p className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5 truncate xs:hidden">
                    {config.shortLabel}
                  </p>
                  
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-none">
                      {typeof value === 'number' ? 
                        (value >= 1000 ? `${(value/1000).toFixed(0)}k` : value.toLocaleString()) 
                        : value
                      }
                    </p>
                    <span className="text-[8px] xs:text-[10px] sm:text-xs font-medium text-green-600 bg-green-50 px-1 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 hidden xs:inline-block">
                      {config.trend}
                    </span>
                  </div>
                </div>

                {/* Icon - Right side */}
                <div className={`p-1 xs:p-1.5 sm:p-2 rounded-lg ${config.bgColor} group-hover:scale-110 transition-transform duration-200 flex-shrink-0 ml-1`}>
                  <Icon className={`h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ${config.color}`} />
                </div>
              </div>
              
              {/* Progress bar indicator - Hidden on extra small screens */}
              <div className="mt-1 xs:mt-1.5 sm:mt-2 md:mt-3 w-full bg-gray-100 rounded-full h-0.5 sm:h-1 hidden xs:block">
                <div 
                  className={`h-0.5 sm:h-1 rounded-full transition-all duration-500 ${config.bgColor.split(' ')[0].replace('bg-', 'bg-')}`}
                  style={{ 
                    width: `${Math.min((value / (key === 'totalViews' ? 10000 : 100)) * 100, 100)}%` 
                  }}
                ></div>
              </div>

              {/* Trend indicator for extra small screens */}
              <div className="mt-0.5 xs:hidden">
                <span className="text-[8px] font-medium text-green-600 whitespace-nowrap">
                  {config.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}