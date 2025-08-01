interface NoteCard {
  id?: number;
  title: string;
  note: string;
}

export type { NoteCard as NoteCardType };

interface NotesResponse {
  success: boolean;
  message?: {
    title: string;
    id: number;
    note: string;
  }[];
  error?: string;
}

export type { NotesResponse };
