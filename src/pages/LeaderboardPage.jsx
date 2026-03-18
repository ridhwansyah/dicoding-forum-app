import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../store/leaderboardSlice';

function LeaderboardPage() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchLeaderboard());
  }, [dispatch, status]);

  return (
    <main className="page">
      <div className="leaderboard-wrapper">
        <h2 className="leaderboard__title">Klasmen Pengguna Aktif</h2>
        <div className="leaderboard__header-row">
          <span>Pengguna</span>
          <span>Skor</span>
        </div>
        {status === 'loading' && <p className="loading-text">Memuat leaderboard...</p>}
        <ul className="leaderboard__list">
          {items.map(({ user, score }) => {
            const initials = (user.name || '?').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
            return (
              <li key={user.id} className="leaderboard__item">
                <div className="leaderboard__user">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="avatar avatar--md" />
                  ) : (
                    <div className="avatar avatar--md avatar--initials">{initials}</div>
                  )}
                  <span>{user.name}</span>
                </div>
                <span className="leaderboard__score">{score}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

export default LeaderboardPage;