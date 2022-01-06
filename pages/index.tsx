import * as React from "react";
import {GetStaticProps} from "next";

import {Product} from "../product/types";
import api from "../product/api";
import {Link, Button, Grid, Stack, Text, Flex, Box, Image } from "@chakra-ui/react";
import { parse } from "path/posix";
// import StoreScreen from "../product/screens/Store";

interface Props {
  products: Product[];
}

function parseCurrency(value: number) : string {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS"
  });
}

const IndexRoute: React.FC<Props> = ({products}) => {
  
  const [cart, setCart] = React.useState<Product[]>([]);
  const whatsappText = React.useMemo(() => {
    return cart
    .reduce((message, product) => message.concat(`* ${product.title} - ${parseCurrency(product.price)} \n`), ``)
    .concat(`\nTotal: ${parseCurrency(cart.reduce((total,product)=> total + product.price, 0))}`);
  }, [cart]);
  return (
    <Stack spacing={6}>
      <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
        { products.map(product => (
        <Stack 
          borderRadius="md" 
          padding={4} 
          spacing={3}
          key={product.id} 
          backgroundColor="gray.100"
        >
          <Image 
            src={product.image} 
            borderRadiusTop="md" 
            maxHeight={128} 
            objectFit="cover" 
          />
          <Stack spacing={1} >
            <Text>{product.title}</Text>
            <Text color="primary.500" fontSize="sm" fontWeight="500">
              {parseCurrency(product.price)}
            </Text>
          </Stack>
          <Button 
            onClick={() => setCart(cart => cart.concat(product) )} 
            colorScheme="primary"
            variant="outline"
            size="sm"
          >
            Agregar
          </Button>
        </Stack>
        )) }
      </Grid>
      {Boolean(cart.length) && (
      <Flex position="sticky" bottom={4} alignItems="center" justifyContent="center">
        <Button
          padding={4}
          isExternal
          as={Link}
          colorScheme={'whatsapp'}
          href={`https://wa.me/5491161960213?text=${encodeURIComponent(whatsappText)}`}
        >
          Completar Pedido ({cart.length}) productos
        </Button>
      </Flex>
      )}
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();

  return {
    revalidate: 10,  // refresh after 10 secs
    props: {
      products,
    },
  };
};

export default IndexRoute;