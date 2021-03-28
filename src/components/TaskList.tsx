import { ChangeEvent } from 'react';
import { Box, BoxProps, Checkbox } from '@chakra-ui/react';
import Task from '../models/task';

type TaskListProps = BoxProps & {
  tasks: Task[];
  onToggle: (taskId: string) => Promise<void>;
};

const TaskList = ({
  tasks,
  onToggle,
  ...boxProps
}: TaskListProps): JSX.Element => {
  const handleChange = (taskId: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    console.log({ taskId });
    onToggle(taskId);
  };
  return (
    <Box {...boxProps}>
      {tasks.map(task => (
        <Box key={task.id}>
          <Checkbox isChecked={task.completed} onChange={handleChange(task.id)}>
            {task.content}
          </Checkbox>
        </Box>
      ))}
    </Box>
  );
};

export default TaskList;
