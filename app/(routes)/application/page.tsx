// import ApplicationWrapper from "@/app/comp/client-side/application-wrapper/ApplicationWrapper";
import Container from "@/app/comp/client-side/container/Container";
import Navbar from "@/app/comp/client-side/Navbar";
import ShowNoteCard from "@/app/comp/client-side/ShowNoteCard/ShowNoteCard";
import { GetAllNotes } from "@/app/server-actions/action.notes";
import { NoteCardType } from "@/app/types/notecard.type";
import AiAgent from "@/app/utils/aiagent/aiagent";

const Application = async () => {
  const notes = await GetAllNotes();
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center gap-10">
        <h1 className="text-3xl w-1/2 font-bold text-gray-900 my-4 mb-6 hover:scale-125 transition-transform">
          Notes
        </h1>
        <AiAgent />
      </div>
      <Container>
        {notes.message?.map((note: NoteCardType) => (
          <ShowNoteCard key={note.id} props={note} />
        ))}
      </Container>
      <div>Footer</div>
      <div className="fixed top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="fixed top-40 left-5 w-16 h-16 bg-yellow-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      <div className="fixed bottom-40 left-5 w-16 h-16 bg-amber-600 rounded-full opacity-20 animate-pulse delay-500"></div>
      <div className="fixed bottom-80 right-12 w-16 h-16 bg-fuchsia-400 rounded-full opacity-20 animate-pulse delay-500"></div>
      <div className="fixed top-90 right-5 w-16 h-16 bg-lime-600 rounded-full opacity-20 animate-pulse delay-500"></div>
    </> // <ApplicationWrapper allNotes={notes} />
  );
};

export default Application;
