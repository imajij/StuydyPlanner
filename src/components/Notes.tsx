import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Subject, Note } from "../types";
import { renderMarkdown } from "../utils/markdown";

export function Notes() {
  const [searchParams] = useSearchParams();
  const subjectFilter = searchParams.get("subject") || "";
  
  const [subjects, setSubjects] = useLocalStorage<Subject[]>("subjects", []);
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", []);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Filter notes based on URL search params
  const filteredNotes = notes.filter(note => {
    if (subjectFilter && note.subjectId !== subjectFilter) return false;
    return true;
  });
  
  // Auto-save timer
  useEffect(() => {
    if (!currentNote) return;
    
    const timer = setTimeout(() => {
      saveNote();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentNote]);
  
  const createNewNote = () => {
    // Default to first subject if no filter is set
    const subjectId = subjectFilter || subjects[0]?.id;
    
    if (!subjectId) {
      alert("Please create a subject first before creating notes.");
      return;
    }
    
    // Fix potential error by ensuring crypto.randomUUID is available
    const noteId = typeof crypto !== 'undefined' && crypto.randomUUID ? 
                  crypto.randomUUID() : 
                  Date.now().toString() + Math.random().toString(36).substring(2);
    
    const newNote: Note = {
      id: noteId,
      subjectId,
      title: "Untitled Note",
      content: "# Untitled Note\n\nStart writing your note here...",
      lastModified: Date.now()
    };
    
    setNotes([...notes, newNote]);
    setCurrentNote(newNote);
    setPreviewMode(false);
  };
  
  const selectNote = (note: Note) => {
    setCurrentNote(note);
    setPreviewMode(false);
  };
  
  const saveNote = () => {
    if (!currentNote) return;
    
    setNotes(notes.map(note => 
      note.id === currentNote.id 
        ? { ...currentNote, lastModified: Date.now() } 
        : note
    ));
  };
  
  const deleteNote = () => {
    if (!currentNote) return;
    if (!confirm("Are you sure you want to delete this note?")) return;
    
    setNotes(notes.filter(note => note.id !== currentNote.id));
    setCurrentNote(null);
  };
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Study Notes</h1>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[#1a1a1a] rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Notes</h2>
            <button
              className="bg-[#fbf0df] text-[#1a1a1a] px-3 py-1 rounded font-bold hover:bg-[#f3d5a3] transition-colors text-sm"
              onClick={createNewNote}
            >
              New Note
            </button>
          </div>
          
          <div className="mb-4">
            <label htmlFor="subjectFilter" className="sr-only">Filter by Subject</label>
            <select 
              id="subjectFilter"
              className="w-full bg-[#2a2a2a] border border-[#fbf0df] rounded p-2 text-white text-sm"
              value={subjectFilter}
              onChange={(e) => {
                const newParams = new URLSearchParams();
                if (e.target.value) {
                  newParams.set("subject", e.target.value);
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
          
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <p className="text-center text-sm opacity-70 p-4">
                No notes found. Create your first note!
              </p>
            ) : (
              filteredNotes
                .sort((a, b) => b.lastModified - a.lastModified)
                .map(note => (
                  <div 
                    key={note.id} 
                    className={`p-2 rounded cursor-pointer hover:bg-[#2a2a2a] transition-colors ${
                      currentNote?.id === note.id ? 'bg-[#2a2a2a] border-l-2 border-[#fbf0df]' : ''
                    }`}
                    onClick={() => selectNote(note)}
                  >
                    <h3 className="font-medium truncate">{note.title}</h3>
                    <p className="text-xs opacity-70">
                      {subjects.find(s => s.id === note.subjectId)?.name || 'Unknown Subject'}
                    </p>
                    <p className="text-xs opacity-70">
                      {new Date(note.lastModified).toLocaleDateString()}
                    </p>
                  </div>
              ))
            )}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {!currentNote ? (
            <div className="bg-[#1a1a1a] rounded-lg p-6 text-center h-[70vh] flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold mb-4">No Note Selected</h3>
              <p className="mb-4">Select a note from the sidebar or create a new one.</p>
              <button
                className="bg-[#fbf0df] text-[#1a1a1a] px-4 py-2 rounded font-bold hover:bg-[#f3d5a3] transition-colors"
                onClick={createNewNote}
              >
                Create New Note
              </button>
            </div>
          ) : (
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <input 
                  type="text" 
                  className="bg-[#2a2a2a] border border-[#fbf0df] rounded p-2 text-white text-lg font-bold flex-1 mr-2"
                  value={currentNote.title}
                  onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
                  onBlur={saveNote}
                  placeholder="Enter note title"
                />
                <div className="flex gap-2">
                  <button
                    className={`px-3 py-1 rounded transition-colors ${
                      previewMode 
                        ? "bg-[#2a2a2a] text-white" 
                        : "bg-[#fbf0df] text-[#1a1a1a] font-bold"
                    }`}
                    onClick={() => setPreviewMode(false)}
                  >
                    Edit
                  </button>
                  <button
                    className={`px-3 py-1 rounded transition-colors ${
                      previewMode 
                        ? "bg-[#fbf0df] text-[#1a1a1a] font-bold" 
                        : "bg-[#2a2a2a] text-white"
                    }`}
                    onClick={() => setPreviewMode(true)}
                  >
                    Preview
                  </button>
                  <button
                    className="bg-red-900/50 border border-red-700 px-3 py-1 rounded hover:bg-red-900 transition-colors"
                    onClick={deleteNote}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="noteSubject" className="sr-only">Select Subject</label>
                <select 
                  id="noteSubject"
                  className="w-full bg-[#2a2a2a] border border-[#fbf0df] rounded p-2 text-white"
                  value={currentNote.subjectId}
                  onChange={(e) => setCurrentNote({...currentNote, subjectId: e.target.value})}
                  onBlur={saveNote}
                >
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="h-[60vh]">
                {previewMode ? (
                  <div 
                    className="bg-[#2a2a2a] rounded p-4 h-full overflow-y-auto prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(currentNote.content) }}
                  ></div>
                ) : (
                  <textarea 
                    className="w-full h-full bg-[#2a2a2a] border border-[#fbf0df] rounded p-4 text-white font-mono resize-none"
                    value={currentNote.content}
                    onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
                    onBlur={saveNote}
                    placeholder="Write your note using Markdown..."
                  ></textarea>
                )}
              </div>
              
              <p className="text-xs opacity-70 mt-2 text-center">
                Last saved: {new Date(currentNote.lastModified).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
