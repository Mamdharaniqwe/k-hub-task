import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './viewnotes.css'; // Import your CSS file

function ViewNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [editedNote, setEditedNote] = useState({ title: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate(); // Import useNavigate for redirection

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/notes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNote(response.data);
      setEditedNote({
        title: response.data.title,
        description: response.data.description
      });
    } catch (error) {
      console.error('Error fetching note:', error);
    }
  };

  const handleEditNote = async () => {
    try {
      await axios.put(`http://localhost:8000/notes/${id}`, editedNote, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsEditing(false);
      fetchNote();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async () => {
    try {
      await axios.delete(`http://localhost:8000/notes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('Note deleted successfully.');
      navigate('/notes'); // Redirect to notes list after deletion
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset editedNote state if needed
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedNote({
      ...editedNote,
      [name]: value
    });
  };

  return (
    <div className="view-note-container">
      <div className="view-note-header">
        <button>
          <Link to="/notes" className="back-to-notes">Back to Notes</Link>
        </button>
        <div className="view-note-actions">
          {!isEditing && (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDeleteNote}>Delete</button>
            </>
          )}
        </div>
      </div>
      {note ? (
        <>
          {isEditing ? (
            <>
              <input
                type="text"
                className="edit-note-title"
                name="title"
                value={editedNote.title}
                onChange={handleInputChange}
              />
              <textarea
                className="edit-note-description"
                name="description"
                value={editedNote.description}
                onChange={handleInputChange}
              />
              <div className="view-note-actions">
                <button onClick={handleEditNote}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h2 className="view-note-title">{note.title}</h2>
              <div className="view-note-description">{note.description}</div>
            </>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ViewNote;
