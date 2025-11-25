"use client";

import { useState, type FormEvent } from "react";

type Sender = "user" | "assistant";

interface ChatMessage {
  id: number;
  sender: Sender;
  text: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_ROVER_AI_URL ?? "http://127.0.0.1:8000/chat";


export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "assistant",
      text: "Hi, I’m the Deakin Rover AI assistant. Tap the bubble and ask me anything about the rover or the Australian Rover Challenge.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nextId, setNextId] = useState(2);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: nextId,
      sender: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setNextId((id) => id + 1);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: { reply: string } = await response.json();

      const assistantMessage: ChatMessage = {
        id: nextId + 1,
        sender: "assistant",
        text: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setNextId((id) => id + 2);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: nextId + 1,
        sender: "assistant",
        text: "Sorry, something went wrong talking to the AI backend. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setNextId((id) => id + 2);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={toggleOpen}
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/40 hover:scale-105 transition-transform text-white"
      >
        {isOpen ? "×" : "AI"}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-80 sm:w-96 rounded-2xl border border-[#2A0E61]/70 bg-black/90 backdrop-blur-md shadow-2xl shadow-purple-500/30 flex flex-col">
          <div className="px-4 py-3 border-b border-[#2A0E61]/70 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Deakin Rover Assistant
              </p>
            </div>
            <button
              type="button"
              onClick={toggleOpen}
              className="text-gray-400 hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 max-h-80 overflow-y-auto px-3 py-3 space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.sender === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    "max-w-[80%] px-3 py-2 rounded-lg text-xs sm:text-sm leading-relaxed " +
                    (message.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
                      : "bg-[#050816] border border-[#2A0E61]/70 text-gray-100")
                  }
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-3 py-2 rounded-lg text-xs bg-[#050816] border border-[#2A0E61]/70 text-gray-300">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-[#2A0E61]/70 bg-black/95 px-3 py-2 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about the rover..."
              className="flex-1 bg-transparent border border-[#2A0E61]/60 rounded-md px-2 py-1.5 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md bg-gradient-to-r from-purple-600 to-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
