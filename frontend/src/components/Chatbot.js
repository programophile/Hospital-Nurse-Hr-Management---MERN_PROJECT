// frontend/src/components/Chatbot.js
import React, { useState } from 'react';

const Chatbot = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');

    const handleQuerySubmit = async (e) => {
        e.preventDefault();
        // Simulate AI response (replace with actual AI integration)
        const simulatedResponse = `You asked: "${query}". This is a simulated response.`;
        setResponse(simulatedResponse);
        setQuery('');
    };

    return (
        <div>
            <h2>AI Chatbot</h2>
            <form onSubmit={handleQuerySubmit}>
                <input type="text" placeholder="Ask a question..." value={query} onChange={(e) => setQuery(e.target.value)} required />
                <button type="submit">Ask</button>
            </form>
            {response && <p>{response}</p>}
        </div>
    );
};

export default Chatbot;