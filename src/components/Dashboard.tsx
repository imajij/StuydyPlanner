import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Subject, Task } from "../types";

export function Dashboard() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>("subjects", []);
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    upcomingDeadline: "",
  });

  useEffect(() => {
    // Calculate dashboard statistics
    const completedTasks = tasks.filter(task => task.status === "done").length;
    
    // Find upcoming deadline
    let upcomingDeadline = "";
    if (subjects.length > 0) {
      const sortedSubjects = [...subjects].sort(
        (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );
      upcomingDeadline = sortedSubjects[0]?.deadline || "";
    }

    setStats({
      totalSubjects: subjects.length,
      totalTasks: tasks.length,
      completedTasks,
      upcomingDeadline,
    });
  }, [subjects, tasks]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Study Planner Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1a1a1a] p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-1">Subjects</h3>
          <p className="text-2xl font-bold">{stats.totalSubjects}</p>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-1">Total Tasks</h3>
          <p className="text-2xl font-bold">{stats.totalTasks}</p>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-1">Completed</h3>
          <p className="text-2xl font-bold">{stats.completedTasks}</p>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-1">Next Deadline</h3>
          <p className="text-xl font-bold">{stats.upcomingDeadline ? new Date(stats.upcomingDeadline).toLocaleDateString() : "None"}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Study Plans</h2>
        <Link 
          to="/subjects/new" 
          className="bg-[#fbf0df] text-[#1a1a1a] px-4 py-2 rounded-lg font-bold hover:bg-[#f3d5a3] transition-colors"
        >
          New Plan
        </Link>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center p-8 bg-[#1a1a1a] rounded-lg">
          <p className="mb-4">You don't have any study plans yet.</p>
          <Link 
            to="/subjects/new" 
            className="bg-[#fbf0df] text-[#1a1a1a] px-4 py-2 rounded-lg font-bold hover:bg-[#f3d5a3] transition-colors"
          >
            Create Your First Plan
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map(subject => (
            <div 
              key={subject.id} 
              className="bg-[#1a1a1a] p-4 rounded-lg border-l-4" 
              style={{ borderLeftColor: subject.color }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{subject.name}</h3>
                <span className="bg-[#2a2a2a] px-2 py-1 rounded text-sm">
                  Due: {new Date(subject.deadline).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Link 
                  to={`/tasks?subject=${subject.id}`} 
                  className="text-[#fbf0df] hover:underline text-sm"
                >
                  View Tasks
                </Link>
                <Link 
                  to={`/notes?subject=${subject.id}`}
                  className="text-[#fbf0df] hover:underline text-sm"
                >
                  View Notes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
