import { List, ListItem } from '@chakra-ui/react';
import Task from '../models/task';

type TaskListProps = {
  tasks: Task[];
};

const TaskList = ({ tasks }: TaskListProps): JSX.Element => {
  return (
    <>
      Tasks:
      <List pl="8">
        {tasks.map(task => (
          <ListItem key={task.id}>
            <strong>{task.content}</strong>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default TaskList;
