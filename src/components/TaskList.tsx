import { Box, BoxProps, Checkbox } from '@chakra-ui/react';
import Task from '../models/task';

type TaskListProps = BoxProps & {
  tasks: Task[];
};

const TaskList = ({ tasks, ...boxProps }: TaskListProps): JSX.Element => {
  return (
    <Box {...boxProps}>
      {tasks.map(task => (
        <Box key={task.id}>
          <Checkbox>{task.content}</Checkbox>
        </Box>
      ))}
    </Box>
  );
};

export default TaskList;
