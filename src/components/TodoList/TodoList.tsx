import { Todo } from '../../types/Todo';

import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  setErrorMessage: (message: string | null) => void,
  handleRemoveButton: (id: number) => void,
  setLoadingId: (id: number | null) => void,
  loadingId: number | null,
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  setErrorMessage,
  handleRemoveButton,
  setLoadingId,
  loadingId,
  tempTodo
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}

      {todos.map(todo => (
        <TodoItem
          todo={todo}
          handleRemoveButton={handleRemoveButton}
          loadingId={loadingId}
          key={todo.id}
        />
      ))}

      {tempTodo && (
  <TodoItem

    todo={tempTodo}
    handleRemoveButton={() => {}}
    loadingId={0}
    key={0}
  />
)}
    </section>
  );
};
