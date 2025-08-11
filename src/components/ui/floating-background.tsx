import { useEffect, useState } from 'react';

const FloatingBackground = () => {
  const [emojis] = useState([
    '📚', '🔍', '🗣️', '👁️', '📝', '🚀', '✨', '💫', '🌟', '⭐',
    '🔮', '💎', '🎯', '🎨', '🎭', '🎪', '🎊', '🎉', '🌈', '🦋'
  ]);

  return (
    <div className="floating-bg">
      {emojis.map((emoji, index) => (
        <div
          key={index}
          className="floating-emoji"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            fontSize: `${1 + Math.random() * 2}rem`,
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingBackground;