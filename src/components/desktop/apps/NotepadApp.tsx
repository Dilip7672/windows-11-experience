import React, { useState, useRef } from 'react';
import { Save, FileText, Plus, X, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export function NotepadApp() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notepad-notes');
    if (saved) {
      try {
        return JSON.parse(saved).map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          updatedAt: new Date(n.updatedAt)
        }));
      } catch {
        return [];
      }
    }
    return [];
  });
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [showSidebar, setShowSidebar] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const saveToStorage = (updatedNotes: Note[]) => {
    localStorage.setItem('notepad-notes', JSON.stringify(updatedNotes));
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Untitled',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setActiveNoteId(newNote.id);
    saveToStorage(updatedNotes);
  };

  const updateNote = (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
    const updatedNotes = notes.map(n => 
      n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n
    );
    setNotes(updatedNotes);
    saveToStorage(updatedNotes);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    if (activeNoteId === id) {
      setActiveNoteId(updatedNotes[0]?.id || null);
    }
    saveToStorage(updatedNotes);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadNote = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title || 'note'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-48 sm:w-56 border-r border-border/50 flex flex-col bg-secondary/20">
          {/* Sidebar Header */}
          <div className="p-2 border-b border-border/50 flex items-center justify-between">
            <span className="text-sm font-medium">Notes</span>
            <button
              onClick={createNewNote}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
              title="New Note"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto">
            {notes.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notes yet</p>
                <button
                  onClick={createNewNote}
                  className="mt-2 text-primary hover:underline text-xs"
                >
                  Create your first note
                </button>
              </div>
            ) : (
              notes.map(note => (
                <button
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={cn(
                    "w-full p-3 text-left hover:bg-secondary/50 transition-colors border-b border-border/30",
                    activeNoteId === note.id && "bg-primary/10 border-l-2 border-l-primary"
                  )}
                >
                  <p className="text-sm font-medium truncate">{note.title || 'Untitled'}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {note.content.slice(0, 50) || 'Empty note'}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {formatDate(note.updatedAt)}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-2 sm:px-3 py-2 border-b border-border/50 bg-secondary/20 gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors sm:hidden"
              title="Toggle Sidebar"
            >
              <FileText className="w-4 h-4" />
            </button>
            {activeNote && (
              <>
                <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors hidden sm:flex" title="Bold">
                  <Bold className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors hidden sm:flex" title="Italic">
                  <Italic className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-border mx-1 hidden sm:block" />
                <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors hidden sm:flex" title="Align Left">
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors hidden sm:flex" title="Align Center">
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors hidden sm:flex" title="Align Right">
                  <AlignRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          {activeNote && (
            <div className="flex items-center gap-1">
              <button
                onClick={downloadNote}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                title="Save as .txt"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteNote(activeNote.id)}
                className="p-1.5 rounded-lg hover:bg-destructive/20 hover:text-destructive transition-colors"
                title="Delete Note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Editor Content */}
        {activeNote ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Title Input */}
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
              placeholder="Note title..."
              className="px-4 py-3 text-lg font-semibold bg-transparent border-b border-border/30 outline-none focus:border-primary/50 transition-colors"
            />
            
            {/* Content Textarea */}
            <textarea
              ref={textareaRef}
              value={activeNote.content}
              onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
              placeholder="Start typing your note..."
              className="flex-1 p-4 resize-none bg-transparent outline-none text-sm leading-relaxed"
            />

            {/* Status Bar */}
            <div className="px-4 py-2 border-t border-border/30 text-xs text-muted-foreground flex items-center justify-between bg-secondary/10">
              <span>{activeNote.content.length} characters</span>
              <span>Last edited: {formatDate(activeNote.updatedAt)}</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">No note selected</p>
              <button
                onClick={createNewNote}
                className="text-primary hover:underline"
              >
                Create a new note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
