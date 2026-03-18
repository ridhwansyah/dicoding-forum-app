import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createThread } from '../store/threadSlice';

function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // PERBAIKAN: pakai useEffect bukan langsung di render
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);
    await dispatch(createThread({ title, body, category }));
    setSubmitting(false);
    navigate('/');
  };

  return (
    <main className="page">
      <h2 className="threads-title" style={{ marginBottom: '1.25rem' }}>
        Buat Thread Baru
      </h2>
      <form className="create-form" onSubmit={handleSubmit}>
        <input
          className="create-form__input"
          placeholder="Judul thread"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="create-form__input"
          placeholder="Kategori (opsional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <textarea
          className="create-form__textarea"
          placeholder="Isi thread..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={6}
        />
        <div className="create-form__actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Membuat...' : 'Buat Thread'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            Batal
          </button>
        </div>
      </form>
    </main>
  );
}

export default NewThreadPage;