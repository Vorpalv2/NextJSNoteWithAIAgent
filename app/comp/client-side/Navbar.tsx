"use client";
import Link from "next/link";
import CreateNoteModal from "./create-note-modal/Modal";
import { SearchIcon, Wifi, WifiOffIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [term, setTerm] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  function searchChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setTerm(e.target.value);
  }

  useEffect(() => {
    function isWifiConnected() {
      setIsConnected(navigator.onLine);
    }

    window.addEventListener("online", isWifiConnected);
    window.addEventListener("offline", isWifiConnected);

    isWifiConnected();

    return () => {
      window.removeEventListener("online", isWifiConnected);
      window.removeEventListener("online", isWifiConnected);
    };
  }, []);

  async function searchTermFetch() {
    const response = await fetch("/api/v1/notes/filter", {
      method: "POST",
      body: JSON.stringify(term),
    });
    let note = await response.json();
    console.log(note);
  }

  return (
    <nav className="flex justify-end items-center px-10 pb-2 shadow-lg rounded-xl">
      {isConnected === null ? (
        "Looking for Connection"
      ) : isConnected ? (
        <span className=" flex gap-2">
          <Wifi /> Connected{" "}
        </span>
      ) : (
        <span className=" flex gap-2">
          <WifiOffIcon /> Not Connected{" "}
        </span>
      )}

      <div className="p-2">
        <CreateNoteModal />
      </div>
      <div>
        <Link className=" p-2" href={"/"}>
          Home
        </Link>
        <Link className=" p-2" href={"/application/contact"}>
          Contact
        </Link>
        <Link className=" p-2" href={"/application/support"}>
          Support
        </Link>
        <Link className=" p-2" href={"/application/profile"}>
          Profile
        </Link>
      </div>
      <div className="flex border-2 rounded-2xl p-2">
        <input
          type="text"
          name="searchTerm"
          onChange={searchChangeHandler}
          placeholder="Search Here"
          value={term}
        />
        <button type="button" onClick={searchTermFetch}>
          <SearchIcon />
        </button>
      </div>
    </nav>
  );
}
