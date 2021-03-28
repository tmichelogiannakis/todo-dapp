import { useEffect, useState } from 'react';
import Web3 from 'web3';
import {
  ChakraProvider,
  Box,
  ListItem,
  OrderedList,
  UnorderedList
} from '@chakra-ui/react';
import theme from './theme';

const App = (): JSX.Element => {
  const [network, setNetwork] = useState<string>('');
  const [accounts, setAccounts] = useState<string[]>([]);

  const loadBlockchainData = async () => {
    if (Web3.givenProvider) {
      const web3 = new Web3(Web3.givenProvider);
      const network = await web3.eth.net.getNetworkType();
      setNetwork(network);
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <ChakraProvider theme={theme}>
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
        </UnorderedList>
      </Box>
    </ChakraProvider>
  );
};

export default App;
