import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Subject, Task } from "../types";

export function Tasks() {
  const [searchParams] = useSearchParams();
  const subjectFilter = searchParams.get("subject") || "";
  const statusFilter = searchParams.get("status") as Task["status"] | "" || "";
  
  const [subjects, setSubjects] = useLocalStorage<Subject[]>("subjects", []);
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [newTask, setNewTask] = useState({ title: "", subjectId: subjectFilter, status: "todo" as const });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Filter tasks based on URL search params
  const filteredTasks = tasks.filter(task => {
    if (subjectFilter && task.subjectId !== subjectFilter) return false;
    if (statusFilter && task.status !== statusFilter) return false;
    return true;
  });
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.subjectId) return;
    
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      subjectId: newTask.subjectId,
      status: newTask.status,
      createdAt: Date.now()
    };
    
    setTasks([...tasks, task]);
    setNewTask({ title: "", subjectId: subjectFilter, status: "todo" });
  };
  
  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };
  
  const handleDeleteTask = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const updateTaskStatus = (id: string, status: Task["status"]) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm mb-1">Filter by Subject</label>
          <select 
            className="w-full bg-[#1a1a1a] border border-[#fbf0df] rounded p-2 text-white"
            value={subjectFilter}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams.toString());
              if (e.target.value) {
                newParams.set("subject", e.target.value);
              } else {
                newParams.delete("subject");
              }
              window.history.pushState({}, "", `?${newParams.toString()}`);
            }}
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm mb-1">Filter by Status</label>
          <select 
            className="w-full bg-[#1a1a1a] border border-[#fbf0df] rounded p-2 text-white"
            value={statusFilter}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams.toString());
              if (e.target.value) {
                newParams.set("status", e.target.value);
              } else {
                newParams.delete("status");
              }
              window.history.pushState({}, "", `?${newParams.toString()}`);
            }}
          >
            <option value="">All Statuses</option>
            <option value="todo">To-do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      
      {/* Add New Task Form */}
      <div className="bg-[#1a1a1a] p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        <form onSubmit={handleAddTask} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Task title"
              className="w-full bg-[#2a2a2a] border border-[#fbf0df] rounded p-2 text-white"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Subject</label>
              <select 
                className="w-full bg-[#2a2a2a] border border-[#fbf0df] rounded p-2 text-white"
                value={newTask.subjectId}
                onChange={(e) => setNewTask({ ...newTask, subjectId: e.target.value })}
                required
              >
                <option value="">Select a subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select 
                className="w-full bg-[#2a2a2a] border border-[#fbf0df] rounded p-2 text-white"
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Task["status"] })}
              >
                <option value="todo">To-do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          
          <button 
            type="submit"
            className="bg-[#fbf0df] text-[#1a1a1a] px-4 py-2 rounded font-bold hover:bg-[#f3d5a3] transition-colors"
          >
            Add Task
          </button>
        </form>
      </div>
      
      {/* Task List */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Task List</h2>
        
        {filteredTasks.length === 0 ? (
          <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
            <p>No tasks match your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <div 
                key={task.id} 
                className="bg-[#1a1a1a] p-3 rounded-lg flex items-center gap-3"
              >
                <div className={`flex-shrink-0 w-4 h-4 rounded-full ${
                  task.status === 'todo' ? 'bg-yellow-500' : 
                  task.status === 'in-progress' ? 'bg-blue-500' : 'bg-green-500'
                }`} />
                
                <div className="flex-1">
                  <p className={`${task.status === 'done' ? 'line-through opacity-70' : ''}`}>
                    {task.title}
                  </p>
                  <p className="text-xs opacity-70">
                    {subjects.find(s => s.id === task.subjectId)?.name || 'Unknown Subject'}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    className="bg-[#2a2a2a] border border-[#fbf0df] rounded text-sm p-1"
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as Task["status"])}
                  >
                    <option value="todo">To-do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  
                  <button 
                    className="text-sm bg-[#2a2a2a] border border-[#fbf0df] rounded p-1 hover:bg-[#3a3a3a] transition-colors"
                    onClick={() => setEditingTask(task)}
                  >
                    Edit
                  </button>
                  
                  <button 
                    className="text-sm bg-red-900/50 border border-red-700 rounded p-1 hover:bg-red-900 transition-colors"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            
            <form onSubmit={handleUpdateTask} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  type="text"
                  className="w-full bg-[#2a2a2a] border border-[#fbf0df] rounded p-2 text-white"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Subject</label>
                <select 
                  className="w-full bg-[#2a2a2a] border border-[#fbf0df] rounded p-2 text-white"
                  value={editingTask.subjectId}
                  onChange={(e) => setEditingTask({ ...editingTask, subjectId: e.target.value })}
                  required
                >
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select 
                  className="w-full bg-[#2a2a2a] border border-[#fbf0df] rounded p-2 text-white"
                  value={editingTask.status}
                  onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as Task["status"] })}
                >
                  <option value="todo">To-do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-2 mt-2">
                <button 
                  type="button"
                  className="bg-[#2a2a2a] px-4 py-2 rounded font-bold hover:bg-[#3a3a3a] transition-colors"
                  onClick={() => setEditingTask(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#fbf0df] text-[#1a1a1a] px-4 py-2 rounded font-bold hover:bg-[#f3d5a3] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
