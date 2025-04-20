import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Subject } from "../types";

export function SubjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useLocalStorage<Subject[]>("subjects", []);
  
  const [formData, setFormData] = useState<Omit<Subject, "id" | "createdAt">>({
    name: "",
    deadline: new Date().toISOString().split('T')[0],
    color: "#FF5733"
  });
  
  const isEditing = id !== "new";
  
  useEffect(() => {
    if (isEditing) {
      const subject = subjects.find(s => s.id === id);
      if (subject) {
        setFormData({
          name: subject.name,
          deadline: new Date(subject.deadline).toISOString().split('T')[0],
          color: subject.color
        });
      } else {
        navigate("/subjects/new");
      }
    }
  }, [id, subjects]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      setSubjects(subjects.map(subject => 
        subject.id === id 
          ? { 
              ...subject, 
              name: formData.name,
              deadline: formData.deadline,
              color: formData.color
            } 
          : subject
      ));
    } else {
      const newSubject: Subject = {
        id: crypto.randomUUID(),
        name: formData.name,
        deadline: formData.deadline,
        color: formData.color,
        createdAt: Date.now()
      };
      setSubjects([...subjects, newSubject]);
    }
    
    navigate("/");
  };
  
  const handleDelete = () => {
    if (!isEditing) return;
    if (!confirm("Are you sure you want to delete this subject? All related tasks and notes will be orphaned.")) return;
    
    setSubjects(subjects.filter(subject => subject.id !== id));
    navigate("/");
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? "Edit Study Plan" : "Create New Study Plan"}
      </h1>
      
      <div className="bg-[#1a1a1a] p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1">Subject Name</label>
            <input
              type="text"
              className="w-full bg-[#2a2a2a] border border-[#fbf0df] rounded p-2 text-white"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Mathematics"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Deadline</label>
            <input
              type="date"
              className="w-full bg-[#2a2a2a] border border-[#fbf0df] rounded p-2 text-white"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Color</label>
            <div className="flex items-center gap-4">
              <input
                        type="color"
                        className="w-12 h-12 rounded border-0 bg-transparent cursor-pointer"
                        value={formData.color}
                        onChange={(e) => {
                          // Ensure color value is valid
                          const validColor = e.target.value;
                          setFormData({ ...formData, color: validColor });
                        }}
                        title="Pick a color for the subject"
                        placeholder="Select a color"
                      />
              <input
                type="text"
                className="flex-1 bg-[#2a2a2a] border border-[#fbf0df] rounded p-2 text-white"
                value={formData.color}
                onChange={(e) => {
                  // Only update if it's a valid hex color or empty
                  const colorValue = e.target.value;
                  const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorValue) || colorValue === "#";
                  if (isValidHex || colorValue === '') {
                    setFormData({ ...formData, color: colorValue });
                  }
                }}
                placeholder="#RRGGBB"
              />
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <button
              type="button"
              className="bg-[#2a2a2a] px-4 py-2 rounded font-bold hover:bg-[#3a3a3a] transition-colors"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            
            <div className="flex gap-2">
              {isEditing && (
                <button
                  type="button"
                  className="bg-red-900/50 border border-red-700 px-4 py-2 rounded hover:bg-red-900 transition-colors"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
              
              <button
                type="submit"
                className="bg-[#fbf0df] text-[#1a1a1a] px-4 py-2 rounded font-bold hover:bg-[#f3d5a3] transition-colors"
              >
                {isEditing ? "Save Changes" : "Create Plan"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
