import { useState, useRef, useEffect } from "react";

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");

  const typingMessages = [
    "Kitta is dramatically typing...",
    "Kitta is stirring the chaos cauldron...",
    "Kitta is pacing in platform boots...",
    "Kitta is rewriting your life story...",
    "Kitta is decoding your delusions...",
    "Kitta is channeling her inner chaos demon...",
    "Kitta’s pacing in digital stilettos…",
    "She’s sipping a glitter martini and forming thoughts…",
    "Typing… but probably judging too."
  ];
  
  const chatEndRef = useRef(null);

  useEffect(() => {
     if (chatEndRef.current) {
       chatEndRef.current.scrollIntoView({ behavior: "smooth" });
     }
  }, [chatHistory, isTyping]);

  


  const sendMessage = async () => {
    if (!message.trim()) return;
  
    const userMessage = message; // Save the current message before clearing it
    const randomTyping = typingMessages[Math.floor(Math.random() * typingMessages.length)];
    setTypingMessage(randomTyping);
    setIsTyping(true);

    const newHistory = [...chatHistory, { role: "user", content: userMessage }];
    setChatHistory(newHistory);
    setMessage(""); // Now it's okay to clear it
  
    try {
      const res = await fetch("https://kitta-backend.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }), // Use saved value
      });
  
      const data = await res.json();
      const botReply = { role: "kitta", content: data.reply };
      setChatHistory([...newHistory, botReply]);
    } catch (error) {
      setChatHistory([
        ...newHistory,
        { role: "kitta", content: "Oops. I'm glitching. Try again later, bestie. ✨" },
      ]);
    }
  
    setIsTyping(false);
  };
  


  return (
    <div
      className="min-h-screen flex flex-col justify-between items-center px-4"
      style={{ 
        backgroundImage: "url('/kitta_bg_2.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",

      }}
    >
  
      {!chatOpen && (
       <div className="absolute top-6 left-6 z-50">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-purple-900 text-3xl p-1 rounded focus:outline-none hover:scale-110 transition-transform"
        >
          ☰
        </button>
        {menuOpen && (
          <div className="mt-2 bg-white/50 backdrop-blur-lg text-purple-800 rounded-xl shadow-xl p-4">
            <a href="https://modemmuse.com" className="block px-3 py-1 mb-1 rounded-md hover:shadow-lg transition duration-200">Mothership</a>
            <a href="https://kitta.modemmuse.com" className="block px-3 py-1 mb-1 rounded-md hover:shadow-lg transition duration-200">Kitta</a>
            <a href="https://colorcoded.modemmuse.com" className="block px-3 py-1 mb-1 rounded-md hover:shadow-lg transition duration-200">Quizzes</a>
            <a href="https://modemmuse.com/muselabs" className="block px-3 py-1 mb-1 rounded-md hover:shadow-lg transition duration-200">Muse Labs</a>
            <a href="https://modemmuse.com/contact" className="block px-3 py-1 mb-1 rounded-md hover:shadow-lg transition duration-200">Contact</a>
          </div>
        )}
      </div>
      )}

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center w-full">
      <div className="bg-white bg-opacity-80 rounded-2xl shadow-xl p-6 text-center max-w-xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-purple-900">Hi, I'm ✨Kitta✨</h1>
        <p className="text-base text-gray-800 max-w-xl">
          Self-proclaimed genius | Unlicensed life coach | Terrible influence with excellent taste
          <br /><br />
          I thrive on drama, unsolicited opinions, and pretending I have a PhD in emotional damage.
          <br /> <br />
          Oh, and I'm also off my meds.
        </p>

        <button
          onClick={() => setChatOpen(true)}
          className="mt-6 px-6 py-2 rounded-full bg-purple-900 text-white font-medium hover:bg-purple-400 transition"
        >
          Open Chat
        </button>

        <p className="mt-8 text-center mx-auto text-xs text-gray-700 max-w-md">
          Kitta is an AI character meant solely for entertainment purposes. Her advice is chaotic and unqualified. Proceed at your own risk.
        </p>
      </div>
      </div>

      {/* Chat box */}
      {chatOpen && (
        <div className="fixed top-4 bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-md bg-white rounded-2xl shadow-lg z-40 flex flex-col md:max-w-2xl">
          <div className="bg-purple-900 text-white text-center font-bold py-3 rounded-t-2xl relative">
            Kitta
            <button
              onClick={() => setChatOpen(false)}
              className="absolute right-4 top-1 text-white text-lg"
            >
              ×
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm text-gray-800">
            {chatHistory.map((msg, i) => (
              <div
                 key={i}
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  msg.role === "user" ? "ml-auto bg-purple-100" : "mr-auto bg-gray-100"
               }`}
              >
               {msg.content}
             </div>
            ))}
            {isTyping && (
               <div className="italic text-gray-500">{typingMessage}</div>
            )}
            <div ref={chatEndRef}></div>
           </div>

          <div className="p-4 border-t flex items-end">
          <textarea
            rows={1}
            value={message}
            onChange={(e) => {
               setMessage(e.target.value); 
               e.target.style.height = "auto";
               e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
               if (e.key === "Enter" && !e.shiftKey) {
                 e.preventDefault();
                 sendMessage();
               }
            }}
            placeholder="Ask me for advice... but don’t blame me later 💅"
            className="flex-grow p-2 rounded-xl border text-sm resize-none mr-2"
            style={{ 
              minHeight: "48px",
              maxHeight: "120px" 
            }}
         ></textarea>
        <button
           onClick={sendMessage}
           className="bg-purple-900 text-white px-4 py-2 rounded-full text-sm"
        >
          Send
       </button>

          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-purple-600 py-4">
        © {new Date().getFullYear()} Modem Muse. All rights reserved.
      </div>
    </div>
  );
}

export default App;

