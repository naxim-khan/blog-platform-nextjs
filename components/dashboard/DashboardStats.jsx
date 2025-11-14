import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye, CheckCircle, Clock, TrendingUp, Users } from "lucide-react";

const statConfig = {
  totalPosts: {
    label: "Total Posts",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border border-blue-100",
    trend: "+12%"
  },
  published: {
    label: "Published",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 border border-green-100",
    trend: "+8%"
  },
  drafts: {
    label: "Drafts",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50 border border-amber-100",
    trend: "-2%"
  },
  totalViews: {
    label: "Total Views",
    icon: Eye,
    color: "text-purple-600",
    bgColor: "bg-purple-50 border border-purple-100",
    trend: "+24%"
  }
};

export default function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Object.entries(statConfig).map(([key, config]) => {
        const Icon = config.icon;
        const value = stats[key] || 0;
        
        return (
          <Card key={key} className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white overflow-hidden group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {config.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                      {config.trend}
                    </span>
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${config.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
              </div>
              
              {/* Progress bar indicator */}
              <div className="mt-3 w-full bg-gray-100 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full ${config.bgColor.split(' ')[0].replace('bg-', 'bg-')}`}
                  style={{ 
                    width: `${Math.min((value / (key === 'totalViews' ? 10000 : 100)) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}