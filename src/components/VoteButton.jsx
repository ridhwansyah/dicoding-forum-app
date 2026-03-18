import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function VoteButton({ upVotesBy = [], downVotesBy = [], onVote }) {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const hasUpVoted = user && upVotesBy.includes(user.id);
  const hasDownVoted = user && downVotesBy.includes(user.id);

  const handleVote = (type) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const current = hasUpVoted ? 1 : hasDownVoted ? -1 : 0;
    onVote(current === type ? 0 : type);
  };

  return (
    <div className="vote-btns">
      <button
        type="button"
        className={`vote-btn ${hasUpVoted ? 'vote-btn--active-up' : ''}`}
        onClick={() => handleVote(1)}
        aria-label="Upvote"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
        <span>{upVotesBy.length}</span>
      </button>
      <button
        type="button"
        className={`vote-btn ${hasDownVoted ? 'vote-btn--active-down' : ''}`}
        onClick={() => handleVote(-1)}
        aria-label="Downvote"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
          <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
        </svg>
        <span>{downVotesBy.length}</span>
      </button>
    </div>
  );
}

export default VoteButton;