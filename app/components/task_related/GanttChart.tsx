import React from "react";
import { TTask, TTaskStatus } from "@/app/constants/type";
import { formatDate } from "@/app/utils/dateUtils";

interface GanttChartProps {
  tasks: TTask[];
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  const getDateRange = () => {
    if (!tasks || tasks.length === 0)
      return { min: new Date(), max: new Date() };

    const dates = tasks.flatMap((task) => [
      task.startDate ? new Date(task.startDate) : new Date(),
      task.dueDate ? new Date(task.dueDate) : new Date(),
    ]);

    const minDate = new Date(Math.min(...dates.map((date) => date.getTime())));
    const maxDate = new Date(Math.max(...dates.map((date) => date.getTime())));

    minDate.setDate(minDate.getDate() - 2);
    maxDate.setDate(maxDate.getDate() + 2);

    return { min: minDate, max: maxDate };
  };

  const { min: minDate, max: maxDate } = getDateRange();
  const totalDays = Math.ceil(
    (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const pxPerDay = 24; 

  const getStatusColor = (status: TTaskStatus = "pending") => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "blocked":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const calculateTaskPosition = (task: TTask) => {
    const start = task.startDate ? new Date(task.startDate) : new Date();
    const end = task.dueDate ? new Date(task.dueDate) : new Date();

    const startOffset = Math.floor(
      (start.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const durationDays = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );

    return {
      left: startOffset * pxPerDay,
      width: durationDays * pxPerDay,
      progressWidth: `${parseInt(task.percentage || "0")}%`,
      startDate: start,
      endDate: end,
    };
  };

  const renderDayMarkers = () => {
    const markers = [];
    for (let i = 0; i <= totalDays; i++) {
      const date = new Date(minDate);
      date.setDate(minDate.getDate() + i);
      const shouldLabel =
        i === 0 || i === totalDays || i % 7 === 0 || date.getDate() === 1;

      markers.push(
        <div
          key={i}
          className="absolute top-0 flex flex-col items-center h-8"
          style={{ left: `${i * pxPerDay}px` }}
        >
          <div className="w-px h-3 bg-gray-300"></div>
          {shouldLabel && (
            <div className="text-[10px] text-gray-500 mt-1 whitespace-nowrap">
              {formatDate(date)}
            </div>
          )}
        </div>
      );
    }
    return markers;
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md overflow-hidden no-scrollbar">
      <h2 className="text-left text-primary font-bold">Project Gantt Chart</h2>

      {/* Timeline and Tasks Container */}
      <div className="relative ">
        {/* Fixed Task Info Column */}
        <div className="absolute left-0 top-0  z-10 bg-white scrollbar-hide">
          <div className="h-8 scrollbar-hide"></div> {/* Spacer for header */}
          {tasks.map((task) => (
            <div key={task._id} className="h-20 p-1 border-b">
              <div className="font-medium truncate">{task.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {task.assignedTo?.[0]?.username || "Unassigned"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {task.startDate && `Start: ${formatDate(task.startDate)}`}
              </div>
              <div className="text-xs text-gray-500">
                {task.dueDate && `Due: ${formatDate(task.dueDate)}`}
              </div>
            </div>
          ))}
        </div>

        {/* Scrollable Timeline Area */}
        <div className="ml-64 overflow-x-auto">
          {/* Header */}
          <div
            className="h-8 relative"
          >
            {renderDayMarkers()}
          </div>

          {/* Tasks */}
          <div className="w-full">
            {tasks.map((task) => {
              const pos = calculateTaskPosition(task);
              const hasStart = !!task.startDate;
              const hasDue = !!task.dueDate;

              return (
                <div key={task._id} className="h-20 relative">
                  <div
                    className="absolute top-6 h-4 rounded-full bg-gray-200 overflow-hidden"
                    style={{ left: `${pos.left}px`, width: `${pos.width}px` }}
                  >
                    <div
                      className={`h-full rounded-full ${getStatusColor(
                        task.status
                      )}`}
                      style={{ width: pos.progressWidth }}
                    ></div>
                  </div>

                  {hasStart && (
                    <div
                      className="absolute top-10 text-xs text-gray-500 whitespace-nowrap"
                      style={{ left: `${pos.left}px` }}
                    >
                      {formatDate(pos.startDate)}
                    </div>
                  )}

                  {hasDue && (
                    <div
                      className="absolute top-10 text-xs text-gray-500 whitespace-nowrap"
                      style={{
                        left: `${pos.left + pos.width}px`,
                        transform: "translateX(-100%)",
                      }}
                    >
                      {formatDate(pos.endDate)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend - Now positioned outside the scrollable area */}
      <div className="mt-6 flex flex-wrap gap-4" >
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm">In Progress</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm">Blocked</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
          <span className="text-sm">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
