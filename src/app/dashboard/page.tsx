"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

// src/app/dashboard/page.tsx



type Note = {
  id: string; user_id: string; title: string; content: string;
  summary: string | null; created_at: string; updated_at: string | null;
};
type UpdateNotePayload = { id: string; title: string; content: string; };

// The NoteCard component does not need any changes.
function NoteCard({ note, onDelete, onUpdate, onSummarize, isSummarizing, isDeleting, isUpdating }: {
  note: Note; onDelete: (id: string) => void; onUpdate: (payload: UpdateNotePayload) => void;
  onSummarize: (note: Note) => void; isSummarizing: boolean; isDeleting: boolean; isUpdating: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleSave = () => {
    if (note.title !== editTitle || note.content !== editContent) {
        onUpdate({ id: note.id, title: editTitle, content: editContent });
    }
    setIsEditing(false);
  };
  const handleCancel = () => {
    setIsEditing(false); setEditTitle(note.title); setEditContent(note.content);
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row md:gap-6">
      <div className="flex-1">{isEditing ? (<>
        <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="mb-2 font-semibold" />
        <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="mb-2 min-h-[120px]" />
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isUpdating}>{isUpdating ? "Saving..." : "Save"}</Button>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
        </div></>) : (<>
        <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
        <p className="text-sm text-gray-700 whitespace-pre-wrap min-h-[60px]">{note.content}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(note.id)} disabled={isDeleting}>{isDeleting ? "Deleting..." : "Delete"}</Button>
          {!note.summary && (<Button onClick={() => onSummarize(note)} disabled={isSummarizing} size="sm">{isSummarizing ? "Summarizing..." : "✨ Summarize"}</Button>)}
        </div></>)}
      </div>
      {note.summary && (<div className="bg-blue-50 border-l-4 border-blue-400 rounded p-3 mt-4 md:mt-0 md:w-2/5">
        <h4 className="font-semibold text-sm text-blue-800 mb-1">AI Summary:</h4>
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.summary}</p>
      </div>)}
    </div>
  );
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summarizingNoteId, setSummarizingNoteId] = useState<string | null>(null);

  const { data: notes, isLoading: isLoadingNotes } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async (newNote: { title: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated.");
      const { error } = await supabase.from("notes").insert({ user_id: user.id, title: newNote.title, content: newNote.content, created_at: new Date().toISOString() });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setTitle(""); setContent("");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note added successfully!"); // REFACTOR: Success notification
    },
    onError: (error) => {
      toast.error(`Failed to add note: ${error.message}`); // REFACTOR: Replaced alert with toast
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onMutate: async (idToDelete) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);
      queryClient.setQueryData<Note[]> (["notes"], (old) => old?.filter((note) => note.id !== idToDelete) ?? []);
      toast.success("Note deleted."); // REFACTOR: Instant feedback on optimistic update
      return { previousNotes };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["notes"], context?.previousNotes);
      toast.error(`Failed to delete note: ${err.message}`); // REFACTOR: Replaced alert with toast
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async (updatedNote: UpdateNotePayload) => {
      const { error } = await supabase.from("notes").update({ title: updatedNote.title, content: updatedNote.content, summary: null, updated_at: new Date().toISOString() }).eq("id", updatedNote.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
        toast.success("Note updated. You can now re-summarize."); // REFACTOR: Success notification
    },
    onMutate: async (updatedNote) => {
        await queryClient.cancelQueries({ queryKey: ['notes'] });
        const previousNotes = queryClient.getQueryData<Note[]>(['notes']);
        queryClient.setQueryData<Note[]>(['notes'], (old) => old?.map(note => note.id === updatedNote.id ? { ...note, ...updatedNote, summary: null } : note) ?? []);
        return { previousNotes };
    },
    onError: (err, newTodo, context) => {
        queryClient.setQueryData(['notes'], context?.previousNotes);
        toast.error(`Failed to update note: ${err.message}`); // REFACTOR: Replaced alert with toast
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const summarizeMutation = useMutation({
    mutationFn: async (note: Note) => {
      setSummarizingNoteId(note.id);
      const apiCall = fetch("/api/summarize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: note.content }) });
      const uxDelay = new Promise((resolve) => setTimeout(resolve, 2000));
      const [response] = await Promise.all([apiCall, uxDelay]);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get summary from server.");
      }
      const { summary } = await response.json();
      const { error } = await supabase.from("notes").update({ summary, updated_at: new Date().toISOString() }).eq("id", note.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Summary generated successfully!"); // REFACTOR: Success notification
    },
    onError: (error: Error) => {
        toast.error(`Summarization failed: ${error.message}`); // REFACTOR: Replaced alert with toast
    },
    onSettled: () => {
        setSummarizingNoteId(null);
    }
  });

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/"; };
  const canAddNote = title.trim() !== "" && content.trim() !== "";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-6 pb-4 border-b">
          <h1 className="text-3xl font-bold text-gray-800">MyNotes</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </header>
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-3">Add a New Note</h2>
          <div className="space-y-3">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Start writing your brilliant idea..." value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[100px]" />
          </div>
          <Button onClick={() => addNoteMutation.mutate({ title, content })} className="mt-3" disabled={!canAddNote || addNoteMutation.isPending}>
            {addNoteMutation.isPending ? "Adding..." : "Add Note"}
          </Button>
        </div>
        <div className="space-y-6">
          {isLoadingNotes ? (<p className="text-center text-gray-500">Loading your notes...</p>)
          : notes && notes.length > 0 ? (notes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={deleteNoteMutation.mutate} onUpdate={updateNoteMutation.mutate} onSummarize={summarizeMutation.mutate} isSummarizing={summarizingNoteId === note.id} isDeleting={deleteNoteMutation.isPending && deleteNoteMutation.variables === note.id} isUpdating={updateNoteMutation.isPending && updateNoteMutation.variables?.id === note.id} />
            )))
          : (<div className="text-center py-10 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700">No notes yet!</h3>
                <p className="text-gray-500 mt-2">Use the form above to add your first note.</p>
            </div>)}
        </div>
      </div>
    </div>
  );
}