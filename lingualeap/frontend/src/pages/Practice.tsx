import React from 'react';
import { MessageSquare } from 'lucide-react';

const Practice: React.FC = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Speaking Practice</h1>
        <p className="text-gray-600">Time to practice your conversation skills with our AI tutor.</p>
      </div>

      {/* Coming Soon Card */}
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <MessageSquare className="h-10 w-10 text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Avatar Conversation Coming Soon!</h2>
          <p className="text-gray-600 mb-6">
            Our AI tutor, Lexi, is getting ready to chat with you. Soon you'll be able to practice real conversations, 
            get instant pronunciation feedback, and improve your speaking skills through interactive dialogue.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">What's Coming:</h3>
            <ul className="text-left space-y-2 text-blue-800">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Real-time speech recognition and analysis
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Interactive conversations with AI avatar
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Pronunciation scoring and feedback
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Conversation scenarios (restaurant, travel, etc.)
              </li>
            </ul>
          </div>

          <button className="btn-secondary">
            Get Notified When Ready
          </button>
        </div>
      </div>
    </div>
  );
};

export default Practice;