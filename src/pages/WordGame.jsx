import React, { useRef, useState } from 'react';
import MyActionListener from '../actions/MyActionListener';
import './WordGame.css';

const LETTERS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
];

const WORD_LENGTH = 5;

function WordGame() {
  const [letters, setLetters] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle', 'success', 'error'
  const actionListener = useRef(new MyActionListener());
  const [isLoading, setIsLoading] = useState(false);

  // Manage keyboard actions
  React.useEffect(() => {
    actionListener.current.registerListener('KEY_PRESS', (key) => {
      console.log(key);

      if (status !== 'idle') return;
      if (key === 'BACK') {
        setLetters((prev) => prev.slice(0, -1));
      } else if (key === 'ENTER') {
        if (letters.length === WORD_LENGTH) {
          checkWord(letters.join(''));
        }
      } else if (letters.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
        setLetters((prev) => [...prev, key]);
      }
    }); 
    return () => {
      actionListener.current.removeListener('KEY_PRESS');
    };
    // eslint-disable-next-line
  }, [letters, status]);

  // Verify the word (API or simple list)
  const checkWord = async (word) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    setIsLoading(false);
  };

  // Handle key click
  const handleKeyClick = (key) => {
    actionListener.current.emit('KEY_PRESS', key);
  };

  // Reset after validation
  React.useEffect(() => {
    if (status !== 'idle') {
      const timer = setTimeout(() => {
        setLetters([]);
        setStatus('idle');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [status]);

  React.useEffect(() => {
    const listener = (e) => actionListener.current.handlePhysicalKey(e);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="wordgame-container">
      {isLoading && <div className="loader-overlay"><div className="loader"></div></div>}
      <div className="squares-row">
        {[...Array(WORD_LENGTH)].map((_, i) => (
          <div
            key={i}
            className={`square ${status === 'success' ? 'success' : ''} ${status === 'error' ? 'error' : ''}`}
          >
            {letters[i] || ''}
          </div>
        ))}
      </div>
    
      <div className="keyboard">
        {LETTERS.map((row, i) => (
          <div className="keyboard-row" key={i}>
            {row.map((key) => (
              <button
                key={key}
                className={`key ${key === 'ENTER' ? 'enter' : ''} ${key === 'BACK' ? 'back' : ''}`}
                onClick={() => handleKeyClick(key)}
                disabled={
                  (key === 'ENTER' && letters.length !== WORD_LENGTH) ||
                  (key !== 'ENTER' && key !== 'BACK' && letters.length === WORD_LENGTH)
                }
                tabIndex={0}
                aria-label={key === 'BACK' ? 'DELETE' : key === 'ENTER' ? 'VALIDATE' : key}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') handleKeyClick(key);
                }}
              >
                {key === 'BACK' ? '⌫' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
      {letters.length === WORD_LENGTH && (
        <div className="instructions">
          Click on the letters and press "ENTER" to validate or "BACK" to delete
        </div>
      )}
    </div>
  );
}

export default WordGame; 