import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import VoteButton from './VoteButton';
import { voteComment, optimisticVoteComment } from '../store/threadDetailSlice';

function CommentItem({ comment, threadId }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleVote = (voteType) => {
    if (!user) return;
    dispatch(optimisticVoteComment({ commentId: comment.id, voteType, userId: user.id }));
    dispatch(voteComment({ threadId, commentId: comment.id, voteType, userId: user.id }));
  };

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: id });

  const initials = (comment.owner?.name || '?')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="comment-item">
      <div className="comment-item__header">
        <div className="comment-item__author">
          {comment.owner?.avatar ? (
            <img src={comment.owner.avatar} alt={comment.owner.name} className="avatar avatar--sm" />
          ) : (
            <div className="avatar avatar--sm avatar--initials">{initials}</div>
          )}
          <span className="comment-item__name">{comment.owner?.name}</span>
        </div>
        <span className="comment-item__time">{timeAgo}</span>
      </div>
      <div
        className="comment-item__content"
        dangerouslySetInnerHTML={{ __html: comment.content }}
      />
      <VoteButton
        upVotesBy={comment.upVotesBy}
        downVotesBy={comment.downVotesBy}
        onVote={handleVote}
      />
    </div>
  );
}

export default CommentItem;