
import React, { useState, useEffect } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import './editor.css';
import * as awarenessProtocol from 'y-protocols/awareness.js';

const ydoc = new Y.Doc();
const xmlFragment = ydoc.getXmlFragment('content');
const provider = new WebsocketProvider('ws://localhost:1234', 'room1', ydoc);
const undoManager = new Y.UndoManager(xmlFragment);
const awareness = new awarenessProtocol.Awareness(ydoc);

provider.awareness = awareness;

provider.on('status', (event) => {
    console.log(event.status, 'from websocket');
});

const CollaborativeEditor = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        const updateContent = () => {
            setContent(xmlFragment.toString());
        };

        xmlFragment.observe(updateContent);

        return () => {
            xmlFragment.unobserve(updateContent);
        };
    }, []);

    const handleEditorChange = (newContent) => {
        xmlFragment.delete(0, xmlFragment.length);

        const newText = new Y.XmlText();
        newText.insert(0, newContent);
        xmlFragment.insert(0, [newText]);
        // Save the newContent to storage
    };

    const handleReset = () => {
        xmlFragment.delete(0, xmlFragment.length);
        setContent('');
    };

    const handleUndo = () => {
        undoManager.undo();
    };

    const handleRedo = () => {
        undoManager.redo();
    };



    return (
        <div className='editor2'>
            <p className='heading'>Custom CollaborativeEditor</p>
            <hr />
            <div className='editor'>
                <textarea
                    value={content}
                    onChange={(e) => handleEditorChange(e.target.value)}
                    className='textArea'
                    rows={10}
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
        </div>
    );
};

export default CollaborativeEditor;

