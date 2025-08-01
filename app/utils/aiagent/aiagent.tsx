"use client";
import { SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function AiAgent() {
  const router = useRouter();
  const [inputData, setInputData] = useState<string>("");
  const [isWaiting, setIsWaiting] = useState(false);

  async function SendtoBackend(e: React.FormEvent) {
    e.preventDefault(); // Prevent default form submission
    setIsWaiting(true);
    try {
      const response = await fetch("http://localhost:4000/api/v1/aiagent", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ aiagent: inputData }),
      });
      console.log("is response okay? ", response.ok);
      if (response.ok) {
        setIsWaiting(false);
        router.refresh();
        setInputData("");
        console.log("response in frontend", response);
      }
    } catch (error) {
      throw new Error("something went wrong with the ai agent");
    }
  }

  return (
    <div className="flex items-center">
      <form onSubmit={SendtoBackend}>
        <input
          className="appearance-none
          px-4 py-3
          text-gray-900 leading-tight
          rounded-lg
          border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          placeholder-gray-500
          shadow-sm
          bg-white"
          type="text"
          name="aiagent"
          id="aiagent"
          value={inputData}
          placeholder={`What do u want to do`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInputData(e.target.value);
          }}
        />
        <button type="submit">
          <SendIcon></SendIcon>
        </button>
      </form>
      {isWaiting && (
        <div className="flex px-4 mx-4">
          {" "}
          <svg
            className="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h1>Working on it....</h1>
        </div>
      )}
    </div>
  );
}

export default AiAgent;
