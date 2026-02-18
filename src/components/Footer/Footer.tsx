import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  onFilterChange: (value: Filter) => void;
  hasCompleted: boolean;
  handleClearCompleted: () => void;
  countOfTodos: number;
  filter: Filter;
};

export const Footer: React.FC<Props> = ({
  onFilterChange,
  hasCompleted,
  handleClearCompleted,
  countOfTodos,
  filter,
}) => {

  const handleAllFilterClick = () => onFilterChange(Filter.All);
    const handleActiveFilterClick = () => onFilterChange(Filter.Active);
      const handleCompletedFilterClick = () => onFilterChange(Filter.Completed);
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countOfTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', { selected: filter === Filter.All })}
          data-cy="FilterLinkAll"
          onClick={handleAllFilterClick}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={handleActiveFilterClick}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={handleCompletedFilterClick
          }
        >
          Completed
        </a>
      </nav>


      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleClearCompleted()}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
