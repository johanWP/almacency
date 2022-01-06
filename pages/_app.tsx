import React from 'react';
import { ChakraProvider, Container, VStack, Image, Heading, Text, Box, Divider } from '@chakra-ui/react'
import { AppProps } from 'next/dist/shared/lib/router/router';
import theme from '../theme';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Box padding={4}>
        <Container
          backgroundColor='white'
          boxShadow='md'
          padding={4}
          maxWidth="container.xl"
          borderRadius="sm"
        >
          <VStack marginBottom={6}>
            <Image src="https://picsum.photos/128" borderRadius={9999} />
            <Heading>Almacency</Heading>
            <Text>This is a sample store built in NextJS</Text>
          </VStack>
          <Divider marginY={6} />
          <Component {...pageProps} />
        </Container>
      </Box>
    </ChakraProvider>
  )
}
export default App