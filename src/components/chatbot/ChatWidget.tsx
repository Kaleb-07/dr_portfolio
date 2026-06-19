import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  User,
  Minimize2,
  Maximize2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { HealthcareChatIcon } from "@/components/shared/HealthcareChatIcon";
import { streamGeminiChat, type ChatMessage } from "../../services/geminiService";

// Helper to escape HTML and format basic Markdown
const formatMarkdown = (text: string): string => {
  if (!text) return "";

  // 1. Safe escape HTML (except what we convert)
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // 3. Inline code: `code`
  html = html.replace(
    /`(.*?)`/g,
    "<code class='px-1 py-0.5 rounded bg-teal-light/60 text-teal font-mono text-[0.85em]'>$1</code>"
  );

  // 4. Parse paragraphs and bullet lists
  const lines = html.split("\n");
  let inList = false;
  const formattedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const content = trimmed.substring(2);
      let output = "";
      if (!inList) {
        inList = true;
        output += "<ul class='list-disc pl-5 my-2 space-y-1 font-sans'>";
      }
      output += `<li>${content}</li>`;
      return output;
    } else {
      let output = "";
      if (inList) {
        inList = false;
        output += "</ul>";
      }
      if (trimmed === "") {
        return output + "<div class='h-2'></div>";
      }
      return output + `<p class='my-1 leading-relaxed font-sans'>${line}</p>`;
    }
  });

  if (inList) {
    formattedLines.push("</ul>");
  }

  return formattedLines.join("");
};



export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      content:
        "Hello! I am Dr. Girma Ababi's virtual assistant. How can I help you today with details about his background, medical practice, research, or the Liyana Healthcare Ecosystem?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamText, isOpen, isMinimized]);

  // Dynamic greeting banner
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMain = () => {
    setShowGreeting(false);
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const openChat = () => {
    setShowGreeting(false);
    setIsOpen(true);
    setIsMenuOpen(false);
    setIsMinimized(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);

    const updatedHistory: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(updatedHistory);
    setIsLoading(true);
    setStreamText("");

    await streamGeminiChat(
      updatedHistory,
      // onChunk
      (chunk) => {
        setStreamText((prev) => prev + chunk);
      },
      // onComplete
      (fullText) => {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: fullText || "I completed processing your request." },
        ]);
        setStreamText("");
        setIsLoading(false);
      },
      // onError
      (err) => {
        console.error("Gemini stream error:", err);
        if (err.message === "API_KEY_MISSING") {
          setError("API_KEY_MISSING");
        } else {
          setError("GENERAL_ERROR");
        }
        setIsLoading(false);
        setStreamText("");
      }
    );
  };

  const socialLinks = [
    {
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.13-.07-.19-.08-.06-.19-.04-.27-.02-.12.03-1.95 1.24-5.5 3.63-.52.36-.99.54-1.41.53-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.4-.89.03-.25.38-.51.99-.78 3.9-1.7 6.5-2.82 7.8-3.37 3.71-1.57 4.48-1.84 4.98-1.85.11 0 .36.02.52.17.13.12.17.28.18.44.01.11.02.28.01.44z" />
        </svg>
      ),
      href: "https://t.me/girmaababi",
      label: "Telegram",
      color: "#26A5E4",
    },
    {
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-white">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.197 1.487 4.85 1.487 5.4 0 9.794-4.385 9.797-9.774.001-2.61-1.012-5.064-2.855-6.908C16.596 2.113 14.137 1.1 11.53 1.1 6.13 1.1 1.737 5.485 1.734 10.874c-.001 1.716.452 3.393 1.312 4.882l-.994 3.633 3.72-.975zM17.48 15.19c-.312-.156-1.848-.912-2.128-1.014-.28-.103-.485-.156-.69.156-.203.312-.787.98-.966 1.185-.177.205-.357.23-.668.074-1.258-.63-2.114-1.096-2.954-2.533-.22-.375.22-.347.63-1.162.068-.136.033-.256-.017-.356-.05-.1-.485-1.17-.665-1.6-.175-.424-.35-.363-.48-.37-.123-.006-.264-.007-.406-.007-.14 0-.37.05-.563.26-.194.21-.74.724-.74 1.767 0 1.043.76 2.05.864 2.19.104.14 1.493 2.28 3.618 3.194.505.218.9.348 1.21.444.508.162.97.14 1.334.085.407-.06 1.848-.756 2.11-1.45.263-.693.263-1.29.183-1.414-.08-.12-.294-.216-.607-.37z" />
        </svg>
      ),
      href: "https://wa.me/251904776464",
      label: "WhatsApp",
      color: "#25D366",
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end gap-3 select-none">
      {/* Social options overlay */}
      <AnimatePresence>
        {!isOpen && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3 mb-1"
          >
            {/* Chatbot toggle widget */}
            <motion.button
              onClick={openChat}
              initial={{ opacity: 0, x: 20, scale: 0.5 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.5 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md border border-rule bg-teal text-white cursor-pointer relative overflow-hidden group"
            >
              <HealthcareChatIcon className="w-full h-full group-hover:scale-110 transition-transform" />
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute right-full mr-3 px-3 py-1.5 bg-paper-card text-ink text-2xs font-mono font-bold uppercase tracking-wider rounded border border-rule shadow pointer-events-none"
              >
                Girma AI Representative
              </motion.span>
            </motion.button>

            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                initial={{ opacity: 0, x: 20, scale: 0.5 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.5 }}
                transition={{ delay: index * 0.08, duration: 0.2 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md relative cursor-pointer"
                style={{ backgroundColor: social.color }}
              >
                {social.icon}
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute right-full mr-3 px-3 py-1.5 bg-paper-card text-ink text-2xs font-mono font-bold uppercase tracking-wider rounded border border-rule shadow pointer-events-none"
                >
                  {social.label}
                </motion.span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? "64px" : "min(520px, 80vh)",
              width: isMinimized ? "180px" : "min(380px, calc(100vw - 2rem))",
            }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-2 bg-paper-card rounded-xl shadow-2xl border border-rule overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-teal p-4 flex items-center justify-between text-white shrink-0 relative overflow-hidden shadow z-10">
              <div className="absolute inset-0 bg-gradient-to-r from-teal to-teal-mid opacity-90" />
              {/* Premium Glow effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center overflow-hidden border border-white/20">
                  <HealthcareChatIcon className="w-full h-full" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-xs leading-none tracking-wide text-white">
                    Girma Assistant
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 bg-teal-light rounded-full animate-pulse" />
                    <span className="text-[9px] text-teal-light font-mono font-bold tracking-widest uppercase">
                      Online
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 relative z-10">
                <button
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
                  title={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
                  title="Close assistant"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Message List */}
                <div
                  ref={scrollRef}
                  className="flex-1 p-4 overflow-y-auto bg-paper/60 space-y-4 scrollbar-none"
                >
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-2 max-w-[85%] ${
                          m.role === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm mt-auto text-[10px] ${
                            m.role === "user"
                              ? "bg-teal text-white"
                              : "bg-paper-card border border-teal/20 text-teal"
                          }`}
                        >
                          {m.role === "user" ? <User size={12} /> : <HealthcareChatIcon className="w-full h-full" />}
                        </div>

                        <div
                          className={`p-3 rounded-xl text-xs leading-relaxed shadow-2xs border ${
                            m.role === "user"
                              ? "bg-teal text-white border-teal rounded-br-none"
                              : "bg-paper-card text-ink-mid border-rule rounded-bl-none"
                          }`}
                        >
                          <div
                            className="space-y-1.5"
                            dangerouslySetInnerHTML={{ __html: formatMarkdown(m.content) }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing stream chunk */}
                  {isLoading && streamText && (
                    <div className="flex justify-start">
                      <div className="flex gap-2 max-w-[85%]">
                        <div className="w-7 h-7 bg-paper-card border border-teal/20 rounded-full flex items-center justify-center overflow-hidden shrink-0 mt-auto text-teal">
                          <HealthcareChatIcon className="w-full h-full" />
                        </div>
                        <div className="p-3 bg-paper-card text-ink-mid border border-rule rounded-xl rounded-bl-none shadow-2xs">
                          <div
                            className="space-y-1.5"
                            dangerouslySetInnerHTML={{ __html: formatMarkdown(streamText) }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading pulsing state */}
                  {isLoading && !streamText && (
                    <div className="flex justify-start">
                      <div className="flex gap-2">
                        <div className="w-7 h-7 bg-paper-card border border-teal/20 rounded-full flex items-center justify-center overflow-hidden shrink-0 mt-auto text-teal">
                          <HealthcareChatIcon className="w-full h-full" />
                        </div>
                        <div className="px-4 py-2.5 bg-paper-card border border-rule rounded-xl rounded-bl-none shadow-2xs flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-teal/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 bg-teal/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-teal/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* API Key Missing or Error States */}
                  {error === "API_KEY_MISSING" && (
                    <div className="flex justify-center px-2 py-1">
                      <div className="bg-gold-light border border-gold/30 text-ink p-3 rounded-lg text-[11px] flex items-start gap-2.5 max-w-[95%] shadow-sm">
                        <AlertCircle size={15} className="shrink-0 mt-0.5 text-gold" />
                        <div>
                          <p className="font-bold tracking-wide">Configuration Required</p>
                          <p className="mt-1 text-ink-mid leading-relaxed font-sans">
                            Please set up the environment configuration by adding your Google Gemini API Key:
                          </p>
                          <code className="block mt-1.5 px-1.5 py-1 rounded bg-gold-light/80 border border-gold/20 font-mono text-[10px] break-all select-all">
                            VITE_GEMINI_API_KEY=your_key_here
                          </code>
                        </div>
                      </div>
                    </div>
                  )}

                  {error === "GENERAL_ERROR" && (
                    <div className="flex justify-center px-2 py-1">
                      <div className="bg-teal-light border border-teal/30 text-ink p-3 rounded-lg text-[11px] flex items-start gap-2.5 max-w-[95%] shadow-sm">
                        <AlertCircle size={15} className="shrink-0 mt-0.5 text-teal" />
                        <div>
                          <p className="font-bold tracking-wide">Service Unavailable</p>
                          <p className="mt-0.5 text-ink-mid leading-relaxed font-sans">
                            I am currently unable to reach the AI model service. Please check your network connection or try again in a few moments.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer and Security Stamp */}
                <div className="px-4 py-2 bg-paper-warm/50 border-t border-rule text-[9px] text-ink-muted text-center flex items-center justify-center gap-1 shrink-0 font-mono tracking-wider uppercase">
                  <ShieldCheck size={11} className="text-teal/70" />
                  <span>Secure Representative • Personal Portfolio Chatbot</span>
                </div>

                {/* Chat Form Area */}
                <form
                  onSubmit={handleSend}
                  className="p-3 bg-paper-card border-t border-rule flex gap-2 shrink-0 items-center"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={error ? "Configuration missing..." : "Ask me anything..."}
                    disabled={isLoading || error === "API_KEY_MISSING"}
                    className="flex-1 bg-paper hover:bg-paper-warm/60 focus:bg-white border border-rule rounded-full px-4 py-2 text-xs text-ink-mid placeholder:text-ink-muted outline-none focus:border-teal transition-all duration-200"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim() || error === "API_KEY_MISSING"}
                    className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center hover:bg-teal-mid hover:shadow disabled:opacity-30 disabled:hover:shadow-none transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
                  >
                    <Send size={13} className="ml-0.5" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat widget trigger */}
      <div className="relative">
        {!isOpen && !isMenuOpen && (
          <div className="absolute inset-0 rounded-full bg-teal/20 animate-ping pointer-events-none" />
        )}

        {/* Dynamic greeting toast */}
        <AnimatePresence>
          {showGreeting && !isOpen && !isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              onClick={openChat}
              className="absolute right-15 bottom-0.5 bg-paper-card border border-rule rounded-xl shadow-lg p-3 flex items-center gap-3 w-60 z-20 cursor-pointer hover:border-teal/30 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Arrow pointer */}
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-l-6 border-l-paper-card" />

              <div className="flex-1 flex gap-2 items-center">
                <div className="w-8 h-8 rounded-full bg-teal/5 flex items-center justify-center text-teal group-hover:scale-105 transition-transform border border-rule shrink-0 overflow-hidden">
                  <HealthcareChatIcon className="w-full h-full" />
                </div>
                <div className="text-left font-sans">
                  <p className="text-[10px] font-bold text-ink uppercase tracking-wide">Girma Representative</p>
                  <p className="text-[10px] text-ink-muted mt-0.5">Need information? Let's chat! 👋</p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGreeting(false);
                }}
                className="text-ink-faint hover:text-ink transition-colors p-1 rounded hover:bg-paper shrink-0 cursor-pointer"
                title="Dismiss greeting"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating action mascot button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMain}
          className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden ${
            isOpen || isMenuOpen
              ? "bg-teal text-white rotate-90"
              : "bg-paper-card border border-rule hover:border-teal/30 text-teal"
          }`}
        >
          {isOpen || isMenuOpen ? (
            <X size={22} />
          ) : (
            <HealthcareChatIcon className="w-full h-full" />
          )}
        </motion.button>

        {/* Unread dot indicator when menu is closed */}
        {!isOpen && !isMenuOpen && (
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 z-10 pointer-events-none flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-teal opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal border border-white shadow-sm" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;
