/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import classNames from 'classnames';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasCompleted = todos.some(todo => todo.completed);

  const countOfTodos = todos.filter(todo => todo.completed === false).length;
  const inputFocusRef = React.useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    inputFocusRef.current?.focus();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
        return true;
    }
  });

  const handleFilterChange = (type: Filter) => {
    setFilter(type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setErrorMessage(null);
    e.preventDefault();
    if (!value.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: value.trim(),
      completed: false,
    };

    setTempTodo(temp);
    setIsSubmitting(true);
    try {
      const newTodo = await createTodo({
        userId: USER_ID,
        title: value.trim(),
        completed: false,
      });

      setTodos(prev => [...prev, newTodo]);
      setValue('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsSubmitting(false);

      setTimeout(() => {
        inputFocusRef.current?.focus();
      }, 0);
    }
  };

  const handleRemoveButton = async (id: number) => {
    try {
      setLoadingId(id);
      await deleteTodo(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      throw error;
    } finally {
      setLoadingId(null);

      setTimeout(() => {
        inputFocusRef.current?.focus();
      }, 0);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfulIds = completedTodos
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(todo => todo.id);

    if (results.some(result => result.status === 'rejected')) {
      setErrorMessage('Unable to delete a todo');
    }

    setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

    setTimeout(() => {
      inputFocusRef.current?.focus();
    }, 0);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {!isLoading && todos.length > 0 && (
            <button
              type="button"
              data-cy="ToggleAllButton"
              className="todoapp__toggle-all"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={inputFocusRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={value}
              onChange={e => setValue(e.target.value)}
              disabled={isSubmitting}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              handleRemoveButton={handleRemoveButton}
              loadingId={loadingId}
              tempTodo={tempTodo}
            />

            <Footer
              onFilterChange={handleFilterChange}
              hasCompleted={hasCompleted}
              handleClearCompleted={handleClearCompleted}
              countOfTodos={countOfTodos}
              filter={filter}
            />
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
