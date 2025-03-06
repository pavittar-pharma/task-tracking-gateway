
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, change, className }: StatCardProps) {
  return (
    <div className={cn(
      "rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md border border-gray-100 dark:border-gray-700",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
          {change && (
            <div className="mt-2 flex items-center">
              <div
                className={cn(
                  "flex items-center text-sm",
                  change.isPositive ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                )}
              >
                <span>
                  {change.isPositive ? "↑" : "↓"} {change.value}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}
