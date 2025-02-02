import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


function Notes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/notes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Sort notes by created_at in descending order (latest first)
      const sortedNotes = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setNotes(sortedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  return (
    <div className="notes-container">
      <h2 className="notes-title">Notes List</h2>
      <Link to="/add-note" className="add-note-link">Add Note</Link>
      <table className="notes-table">
        <tbody>
          {notes.map(note => (
            <tr key={note.id}>
              <td>
                <Link to={`/notes/${note.id}`}>{note.title}</Link>
              </td>
              <td>{new Date(note.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Notes;
