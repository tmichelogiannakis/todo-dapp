import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import {
  ChakraProvider,
  ColorModeScript,
  Box,
  ListItem,
  OrderedList,
  UnorderedList
} from '@chakra-ui/react';
import theme from './theme';
import { default as abiJSON } from './abi.json';

const CONTRACT_ADDRESS = '0x804672E3863d836312eD80D8D0B7d3De051817EA';

type Task = {
  id: string;
  content: string;
  completed: boolean;
};

const App = (): JSX.Element => {
  const [network, setNetwork] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<string[] | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);

  const loadBlockchainData = async () => {
    if (Web3.givenProvider) {
      const web3 = new Web3(Web3.givenProvider);
      const network = await web3.eth.net.getNetworkType();
      setNetwork(network);
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
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
      console.log(tasks);
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
        <UnorderedList>
          {network && (
            <ListItem>
              Network: <strong>{network}</strong>
            </ListItem>
          )}
          {accounts && accounts.length && (
            <ListItem>
              Accounts:
              <OrderedList pl="8">
                {accounts.map(account => (
                  <ListItem key={account}>
                    <strong>{account}</strong>
                  </ListItem>
                ))}
              </OrderedList>
            </ListItem>
          )}
          {tasks && tasks.length && (
            <ListItem>
              Tasks:
              <OrderedList pl="8">
                {tasks.map(task => (
                  <ListItem key={task.id}>
                    <strong>{task.content}</strong>
                  </ListItem>
                ))}
              </OrderedList>
            </ListItem>
          )}
        </UnorderedList>
      </Box>
    </ChakraProvider>
  );
};

export default App;
