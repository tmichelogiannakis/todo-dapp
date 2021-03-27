import { ChakraProvider, Container } from '@chakra-ui/react';
import theme from './theme';

const App = (): JSX.Element => {
  return (
    <ChakraProvider theme={theme}>
      <Container>Hello world</Container>
    </ChakraProvider>
  );
};

export default App;
