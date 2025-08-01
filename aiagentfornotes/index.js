import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.listen(process.env.PORT || 4000, () => {
  console.log("server running on port", process.env.PORT);
});

app.get("/api/v1/aiagent", (req, res) => {
  console.log("working");
  res.json({ success: "true" });
});

app.post("/api/v1/aiagent", async (req, res) => {
  const { aiagent } = req.body;
  console.log(aiagent);

  let response = await callLLM(aiagent);
  res.json({ messages: response });
});

async function callLLM(usertext) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are an AI Helper bot integrated inside a note application which specializes in resolving users' queries related to it.
  The user can and will ask you to perform some specific tasks like create, update, read, or delete a note, which you can do by utilizing the tools provided to you.

  Rules:
    Input Entered by user : input
    Based on the input, we can find the most appropriate tool to call from our tools array to achieve the desired result.

  Example:
    Input : Get all the notes from Database,
    Output : use the function readallnotesfromdatabase to fetch all the data from the database.
  
    Input : Create a new note with title "title test" and note "note test"
    Output : user wants to create a new note which will have the title of title test and the note of note test, by keeping the respective argument in mind, i should call the function createnewnoteinDatabase and pass the arguments to it inorder to create a new entry in database.
  
    // Input : Delete this note with this id from the database
    // Output: user wants to delete the note with the id {35} that is provided alongside it.

    Input : Find this specific note with title from database
    Output: user wants to find a specific note within the database by using the title which is provided alongside it.

    `;

  const input = [
    { role: "system", content: prompt },
    { role: "user", content: usertext },
  ];

  const tools = [
    {
      type: "function",
      function: {
        name: "readallnotesfromdatabase",
        description: "Read all the note entries from the database.",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "createnewnoteinDatabase",
        description:
          "takes the title and the note parameter as arguments and creates a new note by calling the function and passing the parameters in it.",
        parameters: {
          type: "object",
          properties: { title: { type: "string" }, note: { type: "string" } },
          required: [],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "deleteNoteByTitle",
        description:
          "delete a single note entry from the database based on the title property.",
        parameters: {
          type: "object",
          properties: { title: { type: "string" } },
          required: [],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "findOneNoteByTitle",
        description:
          "find a single note entry from the database based on the title property.",
        parameters: {
          type: "object",
          properties: { title: { type: "string" } },
          required: [],
        },
      },
    },
  ];

  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: input,
    tools: tools,
  });

  const message = response.choices[0].message;

  // Check if the LLM wants to call a function
  if (message.tool_calls && message.tool_calls.length > 0) {
    const toolCall = message.tool_calls[0];
    if (toolCall.function.name === "readallnotesfromdatabase") {
      // Actually call the function and return its result
      const dbResult = await readallnotesfromdatabase();
      return dbResult.messages["message"];
    }
    if (toolCall.function.name === "createnewnoteinDatabase") {
      // Parse arguments from toolCall.function.arguments (should be a JSON string)
      const args = JSON.parse(toolCall.function.arguments || "{}");
      const newNote = await createnewnoteinDatabase(args);
      return newNote.message; // or just return newNote if you want the whole response
    }
    if (toolCall.function.name == "deleteNoteByTitle") {
      const args = JSON.parse(toolCall.function.arguments || " {}");
      const deletedNote = await deleteNoteByTitle(args);
      return deletedNote.message;
    }
    if (toolCall.function.name == "findOneNoteByTitle") {
      const args = JSON.parse(toolCall.function.arguments || "{}");
      const filteredNote = await findOneNoteByTitle(args);
      return filteredNote;
    }
  }

  // Otherwise, just return the LLM's message content
  return message.content;
}

async function readallnotesfromdatabase() {
  try {
    const response = await fetch("http://localhost:3000/api/v1/notes");
    const data = await response.json();
    if (!response.ok) {
      return { status: false, messages: "error getting data" };
    }
    return { status: true, messages: data };
  } catch (error) {
    return { status: false, messages: error.message };
  }
}

async function createnewnoteinDatabase({ title, note }) {
  try {
    const response = await fetch("http://localhost:3000/api/v1/notes", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ title, note }),
    });
    const data = await response.json();

    if (!response.ok) {
      return { status: false, message: "something went wrong with api" };
    }
    return { status: true, message: data };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

async function deleteNoteByTitle({ title }) {
  console.log(title);
  console.log(typeof title);
  try {
    const response = await fetch("http://localhost:3000/api/v1/notes/filter", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ title }),
    });
    const data = await response.json();

    if (!response.ok) {
      return {
        status: false,
        message: "something went wrong with delete endpoint",
      };
    }
    return { status: true, message: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function findOneNoteByTitle({ title }) {
  try {
    const response = await fetch("http://localhost:3000/api/v1/notes/filter", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(title),
    });

    if (!response.ok) {
      return { success: false, message: "something went wrong with the API" };
    }
    const data = await response.json();
    console.log("inbackend", data);
    return { success: true, message: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
