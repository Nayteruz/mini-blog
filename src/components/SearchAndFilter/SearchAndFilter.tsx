import { type ChangeEvent, type FC } from "react";
import { usePosts } from "@hooks/usePosts";
import { Input } from "@components/Input";
import type { ICategory } from "@/types";
import { Button } from "@/components/Button";
import { SelectCategory } from "@components/Category";
import { ListRow } from "@components/ListRow";
import { SORT_OPTIONS } from "./const";
import { Heading } from "@components/Heading";
import styles from "./SearchAndFilter.module.css";

interface SearchAndFilterProps {
  onFiltersChange?: () => void;
  categories?: ICategory[];
}

export const SearchAndFilter: FC<SearchAndFilterProps> = ({
  onFiltersChange,
  categories = [],
}) => {
  const {
    searchQuery,
    sortBy,
    selectedCategory,
    handleSearch,
    handleSortChange,
    handleCategoryFilter,
    clearFilters,
    posts,
  } = usePosts();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
    onFiltersChange?.();
  };

  const onSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    handleSortChange(e.target.value as "newest" | "oldest" | "title");
    onFiltersChange?.();
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    handleCategoryFilter(e.target.value);
    onFiltersChange?.();
  };

  const hasActiveFilters =
    searchQuery || sortBy !== "newest" || selectedCategory !== "all";

  return (
    <div className={styles.SearchAndFilter}>
      <div className={styles.searchWrapper}>
        <Input
          placeholder='Поиск по заголовку и тексту...'
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        {searchQuery && (
          <Button
            variant='gray'
            size='small'
            className={styles.clearSearchButton}
            onClick={() => handleSearch("")}
          >
            ×
          </Button>
        )}
      </div>
      <div className={styles.filters}>
        <ListRow label='Категория'>
          <SelectCategory
            value={selectedCategory}
            onChange={handleCategoryChange}
            categories={categories}
            className={styles.selectCategory}
            emptyText='Все категории'
            emptyValue='all'
          />
        </ListRow>
        <ListRow label='Сортировка'>
          <SelectCategory
            value={sortBy}
            onChange={onSortChange}
            categories={SORT_OPTIONS}
            className={styles.selectSort}
          />
        </ListRow>
        {hasActiveFilters && (
          <Button
            variant='gray'
            className={styles.clearFiltersButton}
            onClick={clearFilters}
          >
            Сбросить фильтры
          </Button>
        )}
      </div>
      <Heading as='h6' className={styles.results}>
        Найдено постов: {posts.length}
      </Heading>
    </div>
  );
};
