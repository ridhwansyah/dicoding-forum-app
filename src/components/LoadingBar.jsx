import { useSelector } from 'react-redux';

function LoadingBar() {
  const isLoading = useSelector((state) => state.loading);
  if (!isLoading) return null;
  return (
    <div className="loading-bar">
      <div className="loading-bar__fill" />
    </div>
  );
}

export default LoadingBar;