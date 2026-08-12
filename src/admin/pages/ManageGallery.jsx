import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config.js';
import axios from 'axios';
import { Trash2, Edit2, X, Eye } from 'lucide-react';

export const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', category: 'Events', image_url: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadMethod, setUploadMethod] = useState('file');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [activeImage, setActiveImage] = useState(null); // for lightbox preview

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

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_width = 1200;
          const max_height = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > max_width) {
              height *= max_width / width;
              width = max_width;
            }
          } else {
            if (height > max_height) {
              width *= max_height / height;
              height = max_height;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          }, 'image/jpeg', 0.7);
        };
      };
    });
  };

  const handleEditClick = (img) => {
    setEditingId(img.id);
    setFormData({
      title: img.title,
      category: img.category || 'Events',
      image_url: img.image_url
    });
    setUploadMethod('url');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', category: 'Events', image_url: '' });
    setSelectedFiles([]);
    setUploadMethod('file');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (editingId) {
      setSubmitting(true);
      try {
        await axios.put(`${API_URL}/api/gallery/${editingId}`, {
          title: formData.title,
          category: formData.category,
          image_url: formData.image_url
        }, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
        handleCancelEdit();
        fetchImages();
      } catch (err) {
        console.error(err);
        setError('Failed to update image metadata.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Creating new gallery images
    if (uploadMethod === 'file' && selectedFiles.length === 0) {
      setError('Please select at least one image file.');
      return;
    }
    if (uploadMethod === 'url' && !formData.image_url) {
      setError('Please provide an image URL.');
      return;
    }

    setSubmitting(true);
    try {
      if (uploadMethod === 'file') {
        // Upload multiple files
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const compressed = await compressImage(file);
          
          const uploadData = new FormData();
          uploadData.append('image', compressed);
          
          const uploadRes = await axios.post(`${API_URL}/api/upload`, uploadData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
          });

          // Use the file name (without extension) as default title if not specified, or title + index
          const defaultTitle = selectedFiles.length > 1
            ? `${formData.title || 'Gallery'} (${i + 1})`
            : (formData.title || file.name.replace(/\.[^/.]+$/, ""));

          await axios.post(`${API_URL}/api/gallery`, {
            title: defaultTitle,
            category: formData.category,
            image_url: uploadRes.data.url
          }, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
        }
      } else {
        await axios.post(`${API_URL}/api/gallery`, {
          title: formData.title || 'Gallery Image',
          category: formData.category,
          image_url: formData.image_url
        }, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
      }

      handleCancelEdit();
      const fileInput = document.getElementById('galleryFileInput');
      if (fileInput) fileInput.value = '';
      fetchImages();
    } catch (err) {
      console.error(err);
      setError('Failed to add image(s). Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete image?')) return;
    try {
      await axios.delete(`${API_URL}/api/gallery/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
      fetchImages();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading Gallery...</div>;

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      <h2>Manage Gallery</h2>
      
      <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem', maxWidth: '800px' }}>
        <h3>{editingId ? 'Edit Image Details' : 'Add New Image(s)'}</h3>
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Title/Caption {editingId ? '*' : '(Optional)'}</label>
            <input type="text" placeholder={editingId ? "Image Title" : "Default title or empty to use filename"} className="form-input" style={{ width: '100%' }} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required={!!editingId} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Category</label>
            <select className="form-input" style={{ width: '100%' }} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option>Meetings</option>
              <option>Workshops</option>
              <option>Hackathons</option>
              <option>Events</option>
              <option>Campus</option>
            </select>
          </div>
          
          {!editingId && (
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Upload Method</label>
              <select className="form-input" style={{ width: '100%' }} value={uploadMethod} onChange={e => setUploadMethod(e.target.value)}>
                <option value="file">Upload from Device (Supports Multiple Files & Auto Compression)</option>
                <option value="url">Paste Image URL</option>
              </select>
            </div>
          )}
          
          {editingId || uploadMethod === 'url' ? (
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Image URL</label>
              <input 
                type="text" 
                placeholder="Image URL (e.g. https://example.com/img.jpg)" 
                className="form-input" 
                style={{ width: '100%' }} 
                value={formData.image_url} 
                onChange={e => setFormData({...formData, image_url: e.target.value})} 
                required 
              />
            </div>
          ) : (
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Select Image Files</label>
              <input 
                type="file" 
                id="galleryFileInput"
                accept="image/*" 
                multiple
                className="form-input" 
                style={{ width: '100%', padding: '0.4rem' }} 
                onChange={e => setSelectedFiles(Array.from(e.target.files))} 
                required 
              />
              {selectedFiles.length > 0 && (
                <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', marginTop: '0.4rem', fontWeight: '500' }}>
                  {selectedFiles.length} file(s) selected for compression & upload.
                </div>
              )}
            </div>
          )}
          
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Uploading & Compressing...' : (editingId ? 'Save Changes' : 'Add to Gallery')}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                <X size={16} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3>Gallery Library ({images.length} Images)</h3>
        <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {images.map(img => (
            <div key={img.id} className="glass-card" style={{ padding: '0.75rem', position: 'relative', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ height: '145px', overflow: 'hidden', borderRadius: '8px', position: 'relative' }}>
                <img 
                  src={img.image_url?.startsWith('http') ? img.image_url : `${API_URL}${img.image_url}`} 
                  alt={img.title} 
                  onError={(e) => { e.target.src = 'https://placehold.co/600x400/1e293b/334155?text=Image+Unavailable'; }} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                
                {/* Edit Button - Top Left */}
                <button 
                  onClick={() => handleEditClick(img)} 
                  style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                  title="Edit Details"
                >
                  <Edit2 size={13} />
                </button>

                {/* Delete Button - Top Right */}
                <button 
                  onClick={() => handleDelete(img.id)} 
                  style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: '#ef4444', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                  title="Delete Image"
                >
                  <Trash2 size={13} />
                </button>

                {/* Preview Button - Bottom Right */}
                <button 
                  onClick={() => setActiveImage(img)} 
                  style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                  title="Preview"
                >
                  <Eye size={13} />
                </button>
              </div>
              
              <div style={{ padding: '0.1rem 0.25rem 0.25rem 0.25rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={img.title}>
                  {img.title}
                </h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  {img.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Preview */}
      {activeImage && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setActiveImage(null)}>
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={e => e.stopPropagation()}>
            <img src={activeImage.image_url?.startsWith('http') ? activeImage.image_url : `${API_URL}${activeImage.image_url}`} alt={activeImage.title} onError={(e) => { e.target.src = 'https://placehold.co/600x400/1e293b/334155?text=Image+Unavailable'; }} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '12px' }} />
            <button onClick={() => setActiveImage(null)} style={{ position: 'absolute', top: '-2.5rem', right: 0, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <div style={{ color: '#fff', marginTop: '0.75rem', textAlign: 'center' }}>
              <h3 style={{ margin: 0 }}>{activeImage.title}</h3>
              <p style={{ margin: '0.25rem 0 0 0', color: '#cbd5e1', fontSize: '0.9rem' }}>{activeImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

