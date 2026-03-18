import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  fetchThreadDetail,
  createComment,
  voteThreadDetail,
  optimisticVoteThread,
} from '../store/threadDetailSlice';
import CommentItem from '../components/CommentItem';
import VoteButton from '../components/VoteButton';

function DetailPage() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const { thread, status } = useSelector((state) => state.threadDetail);
  const user = useSelector((state) => state.auth.user);
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    dispatch(fetchThreadDetail(threadId));
  }, [dispatch, threadId]);

  const handleVoteThread = (voteType) => {
    if (!user) return;
    dispatch(optimisticVoteThread({ voteType, userId: user.id }));
    dispatch(voteThreadDetail({ threadId, voteType, userId: user.id }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    await dispatch(createComment({ threadId, content }));
    setContent('');
    setPosting(false);
  };

  if (status === 'loading' || !thread) {
    return <main className="page"><p className="loading-text">Memuat thread...</p></main>;
  }

  const timeAgo = formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true, locale: id });
  const ownerInitials = (thread.owner?.name || '?').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <main className="page">
      <div className="detail-wrapper">
        <span className="thread-item__category">#{thread.category}</span>
        <h1 className="detail__title">{thread.title}</h1>
        <div
          className="detail__body"
          dangerouslySetInnerHTML={{ __html: thread.body }}
        />
        <div className="detail__meta">
          <VoteButton
            upVotesBy={thread.upVotesBy}
            downVotesBy={thread.downVotesBy}
            onVote={handleVoteThread}
          />
          <span className="detail__author-info">
            Dibuat oleh{' '}
            {thread.owner?.avatar ? (
              <img src={thread.owner.avatar} alt={thread.owner.name} className="avatar avatar--sm" />
            ) : (
              <span className="avatar avatar--sm avatar--initials">{ownerInitials}</span>
            )}
            <strong>{thread.owner?.name}</strong>
          </span>
          <span className="thread-item__time">{timeAgo}</span>
        </div>

        <section className="comments-section">
          <h3 className="comments-section__title">Beri komentar</h3>
          {user ? (
            <form className="comment-form" onSubmit={handleComment}>
              <textarea
                className="create-form__textarea"
                placeholder="Tulis komentar..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                required
              />
              <button type="submit" className="btn-primary" disabled={posting}>
                {posting ? 'Mengirim...' : 'Kirim Komentar'}
              </button>
            </form>
          ) : (
            <p className="login-prompt">
              <Link to="/login">Login</Link> untuk memberi komentar
            </p>
          )}

          <h3 className="comments-section__title">
            Komentar ({thread.comments?.length || 0})
          </h3>
          <div className="comments-list">
            {(thread.comments || []).map((comment) => (
              <CommentItem key={comment.id} comment={comment} threadId={threadId} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default DetailPage;