import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useGeminiAI from '../hooks/useGeminiAI';

const INITIAL_MESSAGE =
  "Hello! I'm prep4Job's AI assistant. How can I help you with job searching, resume analysis, or career advice?";

const AIAssistant = () => {

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState('');

  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Using backend AI hook
  const { generateContent, loading } = useGeminiAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  useEffect(() => {

    if (isOpen && messages.length === 0) {

      setMessages([
        {
          text: INITIAL_MESSAGE,
          sender: 'ai'
        }
      ]);

    }

    scrollToBottom();

  }, [isOpen, messages]);

  const handleSend = async () => {

    if (!input.trim()) return;

    const userMessage = input.trim();

    // Add user message
    setMessages(prev => [
      ...prev,
      {
        text: userMessage,
        sender: 'user'
      }
    ]);

    setInput('');

    setIsTyping(true);

    try {

      // AI response from backend
      const aiResponse =
        await generateContent(userMessage);

      setMessages(prev => [
        ...prev,
        {
          text: aiResponse,
          sender: 'ai'
        }
      ]);

    } catch (error) {

      console.log(error);

      setMessages(prev => [
        ...prev,
        {
          text:
            "Sorry, I am unable to process your request right now.",
          sender: 'ai'
        }
      ]);

    } finally {

      setIsTyping(false);

    }
  };

  const Message = ({ msg }) => (

    <div
      className={`flex items-start space-x-2 mb-3 sm:mb-4 ${
        msg.sender === 'user'
          ? 'flex-row-reverse space-x-reverse'
          : ''
      }`}
    >

      <div
        className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
          msg.sender === 'user'
            ? 'bg-blue-500'
            : 'bg-emerald-500'
        }`}
      >

        {msg.sender === 'user'
          ? <User size={16} className="text-white" />
          : <Bot size={16} className="text-white" />
        }

      </div>

      <div
        className={`flex max-w-[75%] sm:max-w-[80%] ${
          msg.sender === 'user'
            ? 'justify-end'
            : 'justify-start'
        }`}
      >

        <div
          className={`p-2 sm:p-3 rounded-2xl ${
            msg.sender === 'user'
              ? 'bg-blue-500 text-white rounded-tr-none'
              : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'
          }`}
        >

          <p className="text-xs sm:text-sm whitespace-pre-wrap">
            {msg.text}
          </p>

        </div>

      </div>

    </div>
  );

  return (

    <div className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 z-50">

      <AnimatePresence>

        {isOpen && (

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95
            }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[92vw] sm:w-[400px] mb-2 sm:mb-4 overflow-hidden border border-gray-200 dark:border-gray-700"
          >

            {/* Header */}
            <div className="p-2 sm:p-4 bg-red-600">

              <div className="flex items-center justify-between">

                <div className="flex items-center space-x-2">

                  <Bot
                    size={24}
                    className="text-white"
                  />

                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    prep4Job AI Assistant
                  </h3>

                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X size={20} />
                </button>

              </div>

            </div>

            {/* Messages */}
            <div className="h-[45vh] sm:h-[400px] overflow-y-auto p-2 sm:p-4 bg-gray-50 dark:bg-gray-800/50">

              {messages.map((msg, index) => (
                <Message
                  key={index}
                  msg={msg}
                />
              ))}

              {(loading || isTyping) && (

                <div className="flex items-center space-x-2">

                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">

                    <Bot
                      size={16}
                      className="text-white"
                    />

                  </div>

                  <div className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 rounded-tl-none">

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8
                      }}
                      className="flex space-x-1"
                    >

                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>

                    </motion.div>

                  </div>

                </div>

              )}

              <div ref={messagesEndRef} />

            </div>

            {/* Input */}
            <div className="p-2 sm:p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">

              <div className="flex items-center space-x-2">

                <input
                  type="text"
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={(e) => {

                    if (
                      e.key === 'Enter' &&
                      !loading
                    ) {
                      handleSend();
                    }

                  }}
                  placeholder="Ask anything about your career..."
                  className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={loading}
                />

                <button
                  onClick={handleSend}
                  disabled={
                    loading ||
                    !input.trim()
                  }
                  className="p-2 rounded-full bg-red-600 text-white disabled:opacity-50 hover:bg-red-700"
                >

                  <Send size={20} />

                </button>

              </div>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

      {/* Toggle Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          setIsOpen(!isOpen)
        }
        className="flex items-center cursor-pointer"
      >

        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0
          }}
          className="bg-red-600 text-white p-3 sm:p-4 rounded-full shadow-lg"
        >

          <MessageCircle size={24} />

        </motion.div>

      </motion.div>

    </div>
  );
};

export default AIAssistant;