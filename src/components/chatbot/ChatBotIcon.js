import React from 'react';

function ChatBotIcon({ onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        backgroundColor: '#0078D7',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        cursor: 'pointer',
        fontSize: '24px'
      }}
    >
      💬
    </div>
  );
}

export default ChatBotIcon;