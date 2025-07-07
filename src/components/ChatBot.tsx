import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Maximize2, Minimize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';

const ChatBot: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    currentSession,
    isWidgetOpen,
    isLoading,
    openWidget,
    closeWidget,
    sendMessage,
    openChat
  } = useChat();

  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isWidgetOpen && currentSession?.messages.length > 0) {
      scrollToBottom();
    }
  }, [currentSession?.messages, isWidgetOpen]);

  const handleOpenChat = () => {
    if (!isAuthenticated) {
      alert('Please sign in to use the chatbot feature.');
      return;
    }
    openWidget();
  };

  const handleMaximize = () => {
    navigate('/chat');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const messageText = message;
    setMessage('');
    await sendMessage(messageText);
  };

  if (!isAuthenticated) {
    return (
      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-40"
        title="Sign in to use chatbot"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <>
      {/* Chat Widget Button */}
      {!isWidgetOpen && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-40"
          title="Open Chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Widget */}
      {isWidgetOpen && (
        <div className="fixed bottom-4 right-4 w-[calc(100vw-2rem)] max-w-96 h-[500px] sm:bottom-6 sm:right-6 sm:w-96 bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-700 shadow-2xl z-50 flex flex-col">
          {/* Widget Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Eyeconic AI</h3>
                <p className="text-gray-400 text-xs">Your AR assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMaximize}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 transition-colors duration-300"
                title="Maximize to full page"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={closeWidget}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 transition-colors duration-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Widget Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {currentSession?.messages.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <MessageCircle className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Hi! I'm your Eyeconic AI assistant.</p>
                <p className="text-xs mt-1">How can I help you today?</p>
              </div>
            )}

            <div className="space-y-4">
              {currentSession?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${msg.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.isUser 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600' 
                        : 'bg-gray-700'
                    }`}>
                      {msg.isUser ? (
                        <span className="text-white text-xs font-semibold">U</span>
                      ) : (
                        <MessageCircle className="h-3 w-3 text-blue-400" />
                      )}
                    </div>
                    
                    <div
                      className={`p-3 rounded-xl text-sm ${
                        msg.isUser
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                          : 'bg-gray-700/50 text-gray-100 border border-gray-600'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                      <MessageCircle className="h-3 w-3 text-blue-400" />
                    </div>
                    <div className="bg-gray-700/50 border border-gray-600 p-3 rounded-xl">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Widget Input */}
          <div className="p-4 border-t border-gray-700">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 transition-all duration-300"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;