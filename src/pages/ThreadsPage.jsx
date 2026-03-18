import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchThreads } from '../store/threadSlice';
import ThreadItem from '../components/ThreadItem';
import CategoryFilter from '../components/CategoryFilter';

function ThreadsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: threads, activeCategory, status } = useSelector((state) => state.threads);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchThreads());
  }, [dispatch, status]);

  const categories = [...new Set(threads.map((t) => t.category).filter(Boolean))];
  const filtered = activeCategory
    ? threads.filter((t) => t.category === activeCategory)
    : threads;

  return (
    <main className="page">
      <CategoryFilter categories={categories} />

      <div className="threads-header">
        <h2 className="threads-title">Diskusi tersedia</h2>
        <button
          type="button"
          className="btn-create"
          onClick={() => navigate('/new')}
        >
          + Buat Thread
        </button>
      </div>

      <div className="threads-list">
        {status === 'loading' && <p className="loading-text">Memuat thread...</p>}
        {filtered.map((thread) => (
          <ThreadItem key={thread.id} thread={thread} />
        ))}
        {filtered.length === 0 && status === 'succeeded' && (
          <p className="empty-text">Tidak ada thread ditemukan.</p>
        )}
      </div>
    </main>
  );
}

export default ThreadsPage;