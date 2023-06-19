import React, { useState, useEffect } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import './editor.css';
import * as awarenessProtocol from 'y-protocols/awareness.js'
// import DoUsername from 'do_username'

const ydoc = new Y.Doc();
const ytext = ydoc.getText('content');
const provider = new WebsocketProvider('ws://localhost:1234', 'room1', ydoc);
const undoManager = new Y.UndoManager(ytext);
let awareness = new awarenessProtocol.Awareness(ydoc)

awareness = provider.awareness

provider.on('status', (event) => {
    console.log(event.status, 'from websocket');
});

const CollaborativeEditor = () => {
    const [content, setContent] = useState('');

    useEffect(() => {


        const updateContent = () => {
            setContent(ytext.toString());
        };

        ytext.observe(updateContent);
        updateContent();


        return () => {
            ytext.unobserve(updateContent);
        };
    }, []);

    const handleEditorChange = (newContent) => {
        ytext.delete(0, ytext.length);
        ytext.insert(0, newContent);
    };

    const handleReset = () => {
        ytext.delete(0, ytext.length);
        setContent('');
    };

    const handleUndo = () => {
        undoManager.undo();
    };

    const handleRedo = () => {
        undoManager.redo();
    };

    return (
        <div className='container'>
            <p className='heading'>Custom CollaborativeEditor</p>
            <hr />
            <div className='editor'>
                <textarea
                    value={content}
                    onChange={(e) => handleEditorChange(e.target.value)}
                    className='textArea'
                />
            </div>

            <button onClick={handleReset} className='Rbutton'>
                Reset content
            </button>

            <button onClick={handleUndo} className='Rbutton'>
                Undo
            </button>

            <button onClick={handleRedo} className='Rbutton'>
                Redo
            </button>
            <p>Current user: {awareness.clientID}</p>
        </div>
    );
};

export default CollaborativeEditor;
