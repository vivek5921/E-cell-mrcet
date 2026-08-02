import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config.js';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

export const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', category: 'Events', image_url: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('file');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  
  const fetchImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/public/gallery`);
      setImages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (uploadMethod === 'file' && !selectedFile) {
      setError('Please select an image file to upload.');
      return;
    }
    if (uploadMethod === 'url' && !formData.image_url) {
      setError('Please provide an image URL.');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      let finalImageUrl = formData.image_url;

      if (uploadMethod === 'file') {
        const uploadData = new FormData();
        uploadData.append('image', selectedFile);
        const uploadRes = await axios.post(`${API_URL}/api/upload`, uploadData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalImageUrl = uploadRes.data.url; // Absolute URL from backend
      }

      await axios.post(`${API_URL}/api/gallery`, {
        title: formData.title,
        category: formData.category,
        image_url: finalImageUrl
      }, { withCredentials: true });
      
      setFormData({ title: '', category: 'Events', image_url: '' });
      setSelectedFile(null);
      
      const fileInput = document.getElementById('galleryFileInput');
      if (fileInput) fileInput.value = '';
      
      fetchImages();
    } catch (err) {
      console.error(err);
      setError('Failed to add image. Please check the inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete image?')) return;
    try {
      await axios.delete(`${API_URL}/api/gallery/${id}`, { withCredentials: true });
      fetchImages();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      <h2>Manage Gallery</h2>
      
      <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h3>Add New Image</h3>
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <input type="text" placeholder="Image Title" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option>Events</option><option>Workshops</option><option>Campus</option>
          </select>
          <select className="form-input" style={{ gridColumn: 'span 2' }} value={uploadMethod} onChange={e => setUploadMethod(e.target.value)}>
            <option value="file">Upload from Device</option>
            <option value="url">Paste Image URL</option>
          </select>
          
          {uploadMethod === 'file' ? (
            <input 
              type="file" 
              id="galleryFileInput"
              accept="image/*" 
              className="form-input" 
              style={{ gridColumn: 'span 2', padding: '0.5rem' }} 
              onChange={e => setSelectedFile(e.target.files[0])} 
              required 
            />
          ) : (
            <input 
              type="text" 
              placeholder="Image URL (e.g. https://example.com/img.jpg)" 
              className="form-input" 
              style={{ gridColumn: 'span 2' }} 
              value={formData.image_url} 
              onChange={e => setFormData({...formData, image_url: e.target.value})} 
              required 
            />
          )}
          
          <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }} disabled={submitting}>
            {submitting ? 'Uploading...' : 'Add Image'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {images.map(img => (
          <div key={img.id} className="glass-card" style={{ padding: '1rem', position: 'relative' }}>
            <img src={img.image_url} alt={img.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
            <h4 style={{ marginTop: '0.5rem', fontSize: '1rem' }}>{img.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{img.category}</p>
            <button onClick={() => handleDelete(img.id)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
