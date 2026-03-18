import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import VoteButton from './VoteButton';
import { voteThread, optimisticVote } from '../store/threadSlice';

function ThreadItem({ thread }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleVote = (voteType) => {
    if (!user) return;
    dispatch(optimisticVote({ threadId: thread.id, voteType, userId: user.id }));
    dispatch(voteThread({ threadId: thread.id, voteType, userId: user.id }));
  };

  const timeAgo = formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true, locale: id });

  const avatar = thread.owner?.avatar
    ? thread.owner.avatar
    : null;

  const initials = (thread.owner?.name || '?')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <article className="thread-item">
      <span className="thread-item__category">#{thread.category}</span>
      <Link to={`/threads/${thread.id}`} className="thread-item__title">
        {thread.title}
      </Link>
      <p
        className="thread-item__body"
        dangerouslySetInnerHTML={{ __html: thread.body.substring(0, 200) + (thread.body.length > 200 ? '...' : '') }}
      />
      <div className="thread-item__meta">
        <VoteButton
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          onVote={handleVote}
        />
        <span className="thread-item__comments">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {thread.totalComments}
        </span>
        <span className="thread-item__time">{timeAgo}</span>
        <span className="thread-item__author">
          Dibuat oleh{' '}
          <span className="thread-item__author-name">
            {avatar ? (
              <img src={avatar} alt={thread.owner?.name} className="thread-item__avatar" />
            ) : null}
            {thread.owner?.name || 'Unknown'}
          </span>
        </span>
      </div>
    </article>
  );
}

export default ThreadItem;