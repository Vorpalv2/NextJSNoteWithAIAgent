// "use client";

// import { NoteCardType, NotesResponse } from "@/app/types/notecard.type";
// import { Link, SearchIcon } from "lucide-react";
// import { useEffect, useState } from "react";
// import CreateNoteModal from "../create-note-modal/Modal";

// export default function ApplicationWrapper({
//   notes,
// }: {
//   notes: NotesResponse;
// }) {
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [allNotes, setAllNotes] = useState<NotesResponse | null>(null);
//   const [filteredNote, setFilteredNote] = useState<NoteCardType | null>(null);

//   useEffect(() => {
//     setAllNotes(notes);
//   }, []);

//   return (
//     <nav className="flex justify-end items-center px-10 pb-2 shadow-lg rounded-xl">
//       <div className="p-2">
//         <CreateNoteModal />
//       </div>
//       <div>
//         <Link className=" p-2" href={"/Home"}>
//           Home
//         </Link>
//         <Link className=" p-2" href={"/application/contact"}>
//           Contact
//         </Link>
//         <Link className=" p-2" href={"/application/support"}>
//           Support
//         </Link>
//         <Link className=" p-2" href={"/application/profile"}>
//           Profile
//         </Link>
//       </div>
//       <div className="flex border-2 rounded-2xl p-2">
//         <input
//           type="text"
//           name="searchTerm"
//           onChange={searchChangeHandler}
//           placeholder="Search Here"
//           value={searchTerm}
//         />
//         <button type="button" onClick={searchTermFetch}>
//           <SearchIcon />
//         </button>
//       </div>
//     </nav>
//   );
// }
