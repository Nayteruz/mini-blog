import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { usePosts } from '../hooks/usePosts';

interface CategoryAccordionProps {
  category: any;
  level: number;
  posts: any[];
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  category,
  level,
  posts
}) => {
  const [isExpanded, setIsExpanded] = useState(level === 0); // Корневые категории раскрыты по умолчанию
  const { getChildCategories } = useCategories();

  const childCategories = getChildCategories(category.id);
  const categoryPosts = posts.filter(post => post.categoryId === category.id);

  const hasChildren = childCategories.length > 0;
  const hasPosts = categoryPosts.length > 0;
  const isEmpty = !hasChildren && !hasPosts;

  return (
    <div className="accordion-item" style={{ marginLeft: `${level * 20}px` }}>
      <div
        className={`accordion-header ${isExpanded ? 'expanded' : ''} ${isEmpty ? 'empty' : ''}`}
        onClick={() => !isEmpty && setIsExpanded(!isExpanded)}
      >
        <div className="accordion-title">
          <span className="category-name">{category.name}</span>
          <span className="category-meta">
            {hasPosts && ` (${categoryPosts.length} пост${categoryPosts.length > 1 ? 'а' : ''})`}
          </span>
        </div>

        {!isEmpty && (
          <div className="accordion-arrow">
            {isExpanded ? '▼' : '►'}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="accordion-content">
          {/* Посты этой категории */}
          {hasPosts && (
            <div className="category-posts">
              {categoryPosts.map(post => (
                <div key={post.id} className="post-item">
                  <h4 className="post-item-title">{post.title}</h4>
                  <div className="post-item-meta">
                    <span className="post-author">Автор: {post.author.name || 'Аноним'}</span>
                    <span className="post-date">
                      {post.createdAt?.toDate?.()?.toLocaleDateString('ru-RU') || 'Неизвестно'}
                    </span>
                  </div>
                  <p className="post-item-preview">
                    {post.text.length > 150 ? `${post.text.substring(0, 150)}...` : post.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Дочерние категории */}
          {hasChildren && (
            <div className="child-categories">
              {childCategories.map(childCategory => (
                <CategoryAccordion
                  key={childCategory.id}
                  category={childCategory}
                  level={level + 1}
                  posts={posts}
                />
              ))}
            </div>
          )}

          {/* Сообщение если категория пустая */}
          {isEmpty && (
            <div className="empty-category">
              В этой категории пока нет постов
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const CategoriesAccordion: React.FC = () => {
  const { categoryTree, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { posts, loading: postsLoading, error: postsError } = usePosts();

  if (categoriesLoading || postsLoading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Загрузка...</div>
      </div>
    );
  }

  if (categoriesError || postsError) {
    return (
      <div className="error-message">
        {categoriesError || postsError}
      </div>
    );
  }

  return (
    <div className="categories-container">
      <h2 className="categories-title">Категории с постами</h2>

      {categoryTree.length === 0 ? (
        <div className="empty-state">
          Категорий пока нет. Создайте первую категорию!
        </div>
      ) : (
        <div className="accordion">
          {categoryTree.map(category => (
            <CategoryAccordion
              key={category.id}
              category={category}
              level={0}
              posts={posts}
            />
          ))}
        </div>
      )}
    </div>
  );
};