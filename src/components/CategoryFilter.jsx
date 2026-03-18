import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../store/threadSlice';

function CategoryFilter({ categories }) {
  const dispatch = useDispatch();
  const activeCategory = useSelector((state) => state.threads.activeCategory);

  return (
    <div className="category-filter">
      <p className="category-filter__label">Kategori populer</p>
      <div className="category-filter__tags">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-tag ${activeCategory === cat ? 'category-tag--active' : ''}`}
            onClick={() => dispatch(setCategory(activeCategory === cat ? '' : cat))}
          >
            #{cat}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;