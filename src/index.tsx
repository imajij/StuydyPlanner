import { serve } from "bun";
import index from "./index.html";
import './index.css';

// Define types for our data
type Subject = {
  id: string;
  name: string;
  deadline: string;
  color: string;
  createdAt: number;
};

type TaskStatus = "todo" | "in-progress" | "done";

type Task = {
  id: string;
  subjectId: string;
  title: string;
  status: TaskStatus;
  createdAt: number;
};

type Note = {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  lastModified: number;
};

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    // Study planner API endpoints - these are mock endpoints for frontend
    // In a real app with localStorage, these would be handled client-side
    
    "/api/subjects": {
      async GET() {
        return Response.json([
          { id: "1", name: "Mathematics", deadline: "2023-12-15", color: "#FF5733", createdAt: Date.now() },
          { id: "2", name: "Physics", deadline: "2023-12-20", color: "#33FF57", createdAt: Date.now() }
        ]);
      },
      async POST(req) {
        const subject = await req.json();
        return Response.json({ ...subject, id: crypto.randomUUID() });
      }
    },
    
    "/api/subjects/:id": {
      async GET(req) {
        return Response.json({ id: req.params.id, name: "Sample Subject", deadline: "2023-12-15", color: "#FF5733", createdAt: Date.now() });
      },
      async PUT(req) {
        const subject = await req.json();
        return Response.json(subject);
      },
      async DELETE(req) {
        return Response.json({ success: true });
      }
    },
    
    "/api/tasks": {
      async GET(req) {
        const url = new URL(req.url);
        const subjectId = url.searchParams.get("subjectId");
        const status = url.searchParams.get("status") as TaskStatus | null;
        
        const tasks = [
          { id: "1", subjectId: "1", title: "Learn derivatives", status: "todo", createdAt: Date.now() },
          { id: "2", subjectId: "1", title: "Practice integrals", status: "in-progress", createdAt: Date.now() },
          { id: "3", subjectId: "2", title: "Study Newton's laws", status: "done", createdAt: Date.now() }
        ];
        
        let filteredTasks = tasks;
        if (subjectId) {
          filteredTasks = filteredTasks.filter(task => task.subjectId === subjectId);
        }
        if (status) {
          filteredTasks = filteredTasks.filter(task => task.status === status);
        }
        
        return Response.json(filteredTasks);
      },
      async POST(req) {
        const task = await req.json();
        return Response.json({ ...task, id: crypto.randomUUID() });
      }
    },
    
    "/api/tasks/:id": {
      async GET(req) {
        return Response.json({ 
          id: req.params.id, 
          subjectId: "1", 
          title: "Sample Task", 
          status: "todo", 
          createdAt: Date.now() 
        });
      },
      async PUT(req) {
        const task = await req.json();
        return Response.json(task);
      },
      async DELETE(req) {
        return Response.json({ success: true });
      }
    },
    
    "/api/notes": {
      async GET(req) {
        const url = new URL(req.url);
        const subjectId = url.searchParams.get("subjectId");
        
        const notes = [
          { id: "1", subjectId: "1", title: "Calculus basics", content: "# Calculus\n\nCalculus is the study of...", lastModified: Date.now() },
          { id: "2", subjectId: "2", title: "Physics formulas", content: "# Important Formulas\n\n- F = ma\n- E = mc²", lastModified: Date.now() }
        ];
        
        if (subjectId) {
          return Response.json(notes.filter(note => note.subjectId === subjectId));
        }
        
        return Response.json(notes);
      },
      async POST(req) {
        const note = await req.json();
        return Response.json({ ...note, id: crypto.randomUUID() });
      }
    },
    
    "/api/notes/:id": {
      async GET(req) {
        return Response.json({ 
          id: req.params.id, 
          subjectId: "1", 
          title: "Sample Note", 
          content: "# Sample content\n\nThis is a sample note.", 
          lastModified: Date.now() 
        });
      },
      async PUT(req) {
        const note = await req.json();
        return Response.json(note);
      },
      async DELETE(req) {
        return Response.json({ success: true });
      }
    },
    
    "/api/stats": {
      async GET() {
        return Response.json({
          totalSubjects: 2,
          totalTasks: 3,
          completedTasks: 1,
          tasksInProgress: 1,
          todoTasks: 1,
          upcomingDeadline: "2023-12-15"
        });
      }
    }
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
