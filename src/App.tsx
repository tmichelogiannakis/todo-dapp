import { useEffect, useRef, useState, ElementRef, FormEvent } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import {
  ChakraProvider,
  ColorModeScript,
  Container,
  Box,
  Flex,
  Spinner,
  Button,
  Input
} from '@chakra-ui/react';
import theme from './theme';
import { default as abiJSON } from './abi.json';
import TaskList from './components/TaskList';
import Task from './models/task';

const CONTRACT_ADDRESS = '0x804672E3863d836312eD80D8D0B7d3De051817EA';

const App = (): JSX.Element => {
  const web3Ref = useRef<Web3>(
    new Web3(Web3.givenProvider || 'http://localhost:8545/')
  );
  const contractRef = useRef<Contract>(
    new web3Ref.current.eth.Contract(abiJSON as AbiItem[], CONTRACT_ADDRESS)
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const taskRef = useRef<ElementRef<typeof Input> | null>(null);

  const loadBlockchainData = async () => {
    setLoading(true);
    const contract = contractRef.current;
    const taskCount = await contract.methods.taskCount().call();
    const taskPromises = Array(Number(taskCount))
      .fill(null)
      .map((_, i) => contract.methods.tasks(i + 1).call());
    const tasks = await Promise.all(taskPromises);
    setLoading(false);
    setTasks(tasks);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const onSubmit = async (event: FormEvent<unknown>) => {
    event.preventDefault();
    const payload = taskRef?.current?.value;
    if (payload) {
      const web3 = web3Ref.current;
      const contract = contractRef.current;
      const accounts = await web3?.eth.getAccounts();
      setIsSubmitting(true);
      contract.methods
        .createTask(payload)
        .send({ from: accounts[0] })
        .once('receipt', (receipt: any) => {
          const { returnValues } = receipt.events.TaskCreated;
          setIsSubmitting(false);
          setTasks(prev => [...prev, returnValues]);
          (event.target as HTMLFormElement).reset();
        });
    }
  };

  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeScript />
      <Container
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Flex as="form" onSubmit={onSubmit} width="100%">
          <Input
            borderRightRadius="0"
            type="text"
            id="task"
            name="task"
            placeholder="Task"
            aria-label="Task"
            ref={taskRef}
          />
          <Button
            type="submit"
            borderLeftRadius="0"
            flexShrink={0}
            isLoading={isSubmitting}
            w="24"
          >
            Submit
          </Button>
        </Flex>
        <Box width="100%" mt="4">
          {loading ? <Spinner /> : <TaskList tasks={tasks} />}
        </Box>
      </Container>
    </ChakraProvider>
  );
};

export default App;
