// AvatarSystem.js - Core component for the Kathakali avatar
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AvatarSystem.css';

const AvatarSystem = ({ 
  isVisible = true,
  emotion = 'neutral',
  message = null,
  position = 'bottom-right',
  onClose,
  onAction,
  actionOptions = []
}) => {
  const [isExpanded, setIsExpanded] = useState(!!message);
  const [currentEmotion, setCurrentEmotion] = useState(emotion);
  
  useEffect(() => {
    setCurrentEmotion(emotion);
  }, [emotion]);
  
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && !message) {
      // If expanding without a message, trigger default greeting
      onAction && onAction('greeting');
    }
  };
  
  const handleActionClick = (actionType) => {
    onAction && onAction(actionType);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className={`avatar-system ${position}`}>
      <AnimatePresence>
        {isExpanded && message && (
          <motion.div 
            className="avatar-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="message-content">
              {message}
            </div>
            
            {actionOptions.length > 0 && (
              <div className="action-buttons">
                {actionOptions.map(option => (
                  <button 
                    key={option.type} 
                    onClick={() => handleActionClick(option.type)}
                    className={option.primary ? 'primary' : 'secondary'}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className={`avatar-character ${currentEmotion}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggleExpand}
      >
        <img 
          src={`/assets/kathakali-${currentEmotion}.png`} 
          alt="Kathakali Guide" 
          className="avatar-image"
        />
      </motion.div>
    </div>
  );
};

export default AvatarSystem;