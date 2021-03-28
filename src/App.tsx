import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import {
  ChakraProvider,
  ColorModeScript,
  Box,
  Spinner
} from '@chakra-ui/react';
import theme from './theme';
import { default as abiJSON } from './abi.json';
import TaskList from './components/TaskList';
import Task from './models/task';

const CONTRACT_ADDRESS = '0x804672E3863d836312eD80D8D0B7d3De051817EA';

const App = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadBlockchainData = async () => {
    if (Web3.givenProvider) {
      setLoading(true);
      const web3 = new Web3(Web3.givenProvider);
      const contract = new web3.eth.Contract(
        abiJSON as AbiItem[],
        CONTRACT_ADDRESS
      );
      const taskCount = await contract.methods.taskCount().call();
      const taskPromises = Array(taskCount)
        .fill(null)
        .map((_, i) => contract.methods.tasks(i + 1).call());
      const tasks = await Promise.all(taskPromises);
      setTasks(tasks);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeScript />
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {loading ? <Spinner /> : <TaskList tasks={tasks} />}
      </Box>
    </ChakraProvider>
  );
};

export default App;
