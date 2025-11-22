// src/components/dashboard/StatCard.tsx
import React from "react";
import { LucideProps } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease" | "pending";
  icon: React.ComponentType<LucideProps>;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}) => {
  const changeColor = {
    increase: "text-green-600 dark:text-green-400",
    decrease: "text-red-600 dark:text-red-400",
    pending: "text-yellow-600 dark:text-yellow-400",
  }[changeType];

  return (
    <div className="p-4 bg-white dark:bg-[#1a1d24] rounded-2xl shadow-lg flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        <p className={`text-sm mt-1 ${changeColor}`}>{change}</p>
      </div>
      <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
        <Icon className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
      </div>
    </div>
  );
};

export default StatCard;
