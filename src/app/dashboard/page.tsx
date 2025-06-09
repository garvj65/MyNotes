"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { summarizeNote } from "@/lib/groq";
import { supabase } from "@/lib/supabase";

type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  summary: string | null;
  created_at: string;
  updated_at: string | null;
};

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [summarizingNoteId, setSummarizingNoteId] = useState<string | null>(null);
  const [summarizeStatus, setSummarizeStatus] = useState<"analyzing" | "summarizing" | null>(null);

  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addNote = useMutation({
    mutationFn: async () => {
      const user = (await supabase.auth.getUser()).data.user;
      const { error } = await supabase.from("notes").insert({
        user_id: user?.id,
        title,
        content,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setTitle("");
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const updateNote = useMutation({
    mutationFn: async (updatedNote: { id: string; title: string; content: string }) => {
      const { error } = await supabase
        .from("notes")
        .update({
          title: updatedNote.title,
          content: updatedNote.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedNote.id);
      if (error) throw error;
    },
    onSuccess: () => {
      setEditingNoteId(null);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const summarizeMutation = useMutation({
    mutationFn: async (note: Note) => {
      setSummarizingNoteId(note.id);
      setSummarizeStatus("analyzing");

      await new Promise((r) => setTimeout(r, 5000));
      setSummarizeStatus("summarizing");

      await new Promise((r) => setTimeout(r, 3000));
      const summary = await summarizeNote(note.content);

      const { error } = await supabase
        .from("notes")
        .update({ summary, updated_at: new Date().toISOString() })
        .eq("id", note.id);

      if (error) throw error;
    },
    onSuccess: () => {
      setSummarizingNoteId(null);
      setSummarizeStatus(null);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>

      {/* Add New Note */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">New Note</h2>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2"
        />
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-2"
        />
        <Button onClick={() => addNote.mutate()}>Add Note</Button>
      </div>

      {/* Notes List */}
      <div className="space-y-6">
        {isLoading ? (
          <p>Loading notes...</p>
        ) : (
          notes?.map((note) => (
            <div key={note.id} className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:gap-6">
              {/* Left: Content or Editor */}
              <div className="flex-1">
                {editingNoteId === note.id ? (
                  <>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mb-2"
                    />
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => updateNote.mutate({ id: note.id, title: editTitle, content: editContent })}>Save</Button>
                      <Button variant="outline" onClick={() => setEditingNoteId(null)}>Cancel</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">{note.title}</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{note.content}</p>
                    <div className="mt-2 flex gap-2">
                      <Button variant="outline" onClick={() => {
                        setEditTitle(note.title);
                        setEditContent(note.content);
                        setEditingNoteId(note.id);
                      }}>
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => deleteNote.mutate(note.id)}>Delete</Button>
                      <Button
                        onClick={() => summarizeMutation.mutate(note)}
                        disabled={summarizingNoteId === note.id}
                      >
                        {summarizingNoteId === note.id
                          ? summarizeStatus === "analyzing"
                            ? "Analyzing..."
                            : "Summarizing..."
                          : "Summarize"}
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {/* Right: Summary Display */}
              {note.summary && (
                <div className="bg-gray-100 rounded p-3 mt-4 md:mt-0 md:w-1/2">
                  <h4 className="font-semibold text-sm mb-1">AI Summary:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.summary}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
