import { type ChangeEvent, type FC } from 'react';
import { usePosts } from '../../hooks/usePosts';
import { useCategories } from '../../hooks/useCategories';
import './index.css';

interface SearchAndFilterProps {
  onFiltersChange?: () => void;
}

export const SearchAndFilter: FC<SearchAndFilterProps> = ({ onFiltersChange }) => {
  const {
    searchQuery,
    sortBy,
    selectedCategory,
    handleSearch,
    handleSortChange,
    handleCategoryFilter,
    clearFilters,
    posts
  } = usePosts();

  const { categories } = useCategories();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
    onFiltersChange?.();
  };

  const onSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    handleSortChange(e.target.value as 'newest' | 'oldest' | 'title');
    onFiltersChange?.();
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    handleCategoryFilter(e.target.value);
    onFiltersChange?.();
  };

  const hasActiveFilters = searchQuery || sortBy !== 'newest' || selectedCategory !== 'all';

  return (
    <div className="search-filter-panel">
      <div className="search-section">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Поиск по заголовку и тексту..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="clear-search-button"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="categoryFilter" className="filter-label">
            Категория:
          </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="all">Все категории</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortFilter" className="filter-label">
            Сортировка:
          </label>
          <select
            id="sortFilter"
            value={sortBy}
            onChange={onSortChange}
            className="filter-select"
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="title">По заголовку (А-Я)</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="clear-filters-button"
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      <div className="results-info">
        Найдено постов: {posts.length}
        {hasActiveFilters && ' (применены фильтры)'}
      </div>
    </div>
  );
};