// import React, { useState, useRef, useEffect } from 'react';
// import { MessageCircle, X, Send } from 'lucide-react';

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [sessionData, setSessionData] = useState({});
//   const messagesEndRef = useRef(null);
//   const [loading, setLoading] = useState(false);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!message.trim()) return;

//     const userMessage = message;
//     setMessage('');
//     setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
//     setLoading(true);

//     try {
//       const response = await fetch('http://localhost:5000/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           message: userMessage,
//           sessionData,
//         }),
//       });

//       const data = await response.json();
//       setSessionData(data.sessionData);
//       setMessages(prev => [...prev, { text: data.response, isBot: true }]);
//     } catch (error) {
//       console.error('Error:', error);
//       setMessages(prev => [...prev, { 
//         text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
//         isBot: true 
//       }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       {/* Chat Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`${
//           isOpen ? 'hidden' : 'flex'
//         } items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors`}
//       >
//         <MessageCircle size={24} />
//       </button>

//       {/* Chat Window */}
//       {isOpen && (
//         <div className="w-96 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col">
//           {/* Header */}
//           <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
//             <h2 className="text-lg font-semibold">Chat with us</h2>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="hover:bg-blue-700 p-1 rounded"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
//               >
//                 <div
//                   className={`max-w-[80%] p-3 rounded-lg ${
//                     msg.isBot
//                       ? 'bg-gray-100 text-gray-800'
//                       : 'bg-blue-600 text-white'
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             ))}
//             {loading && (
//               <div className="flex justify-start">
//                 <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
//                   Typing...
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Form */}
//           <form onSubmit={handleSendMessage} className="p-4 border-t">
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type your message..."
//                 className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-600"
//               />
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
//                 disabled={loading}
//               >
//                 <Send size={20} />
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;






































































import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionData, setSessionData] = useState(() => {
    // Try to load session from localStorage
    const savedSession = localStorage.getItem('chatbotSession');
    return savedSession ? JSON.parse(savedSession) : {};
  });
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Save session data whenever it changes
  useEffect(() => {
    localStorage.setItem('chatbotSession', JSON.stringify(sessionData));
  }, [sessionData]);
  console.log(sessionData);
  
  // Load chat history if user is registered
  useEffect(() => {
    const loadChatHistory = async () => {
      if (sessionData.userId) {
        try {
          const response = await fetch(`http://localhost:5000/api/chat-history/${sessionData.userId}`);
          const history = await response.json();
          setMessages(history.map(msg => ({
            text: msg.message,
            isBot: msg.is_bot
          })));
        } catch (error) {
          console.error('Error loading chat history:', error);
        }
      }
    };

    if (isOpen) {
      loadChatHistory();
    }
  }, [isOpen, sessionData.userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle registration flow messages
  const getRegistrationPrompt = () => {
    if (!sessionData.email) {
      return "Welcome! To get started, please provide your email address.";
    }
    if (!sessionData.name) {
      return "Thank you! Could you please tell me your name?";
    }
    if (!sessionData.phone) {
      return "Great! Finally, what's your phone number?";
    }
    return null;
  };

  useEffect(() => {
    // Show registration prompt when chat opens
    if (isOpen && !sessionData.userId) {
      const prompt = getRegistrationPrompt();
      if (prompt) {
        setMessages(prev => [...prev, { text: prompt, isBot: true }]);
      }
    }
  }, [isOpen, sessionData]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionData,
        }),
      });

      const data = await response.json();
      console.log(data);
      
      // Update session data
      setSessionData(data.sessionData);
      
      // Add bot response to messages
      setMessages(prev => [...prev, { text: data.response, isBot: true }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
        isBot: true 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Reset session
  const handleReset = () => {
    setSessionData({});
    setMessages([]);
    localStorage.removeItem('chatbotSession');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'hidden' : 'flex'
        } items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors`}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="w-96 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
            <div>
              <h2 className="text-lg font-semibold">Chat with us</h2>
              {sessionData.userId && (
                <p className="text-sm opacity-75">Welcome back, {sessionData.name}!</p>
              )}
            </div>
            <div className="flex gap-2">
              {sessionData.userId && (
                <button
                  onClick={handleReset}
                  className="hover:bg-blue-700 p-1 rounded text-sm"
                >
                  Reset
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-700 p-1 rounded"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;