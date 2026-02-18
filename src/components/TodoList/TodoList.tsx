import { Todo } from '../../types/Todo';

import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  handleRemoveButton: (id: number) => void;
  loadingId: number | null;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleRemoveButton,
  loadingId,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

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
          key={tempTodo.id}
        />
      )}
    </section>
  );
};
