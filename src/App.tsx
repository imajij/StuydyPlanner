import "./index.css";
import React from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route

// Import page components
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { SubjectForm } from "./components/SubjectForm";
import { Tasks } from "./components/Tasks";
import { Notes } from "./components/Notes";

export function App() {
  return (
    <Layout> {/* Wrap everything in Layout */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/subjects/:id" element={<SubjectForm />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </Layout>
  );
}

export default App;
