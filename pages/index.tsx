import * as React from "react";
import {GetStaticProps} from "next";

import {Product} from "../product/types";
import api from "../product/api";
import {Link, Button, Grid, Stack, Text, Flex, Box, Image } from "@chakra-ui/react";
import {motion, AnimatePresence, AnimateSharedLayout} from "framer-motion"

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
  const [selectedImage, setSelectedImage] = React.useState<string|null>(null);
  const whatsappText = React.useMemo(() => {
    return cart
    .reduce((message, product) => message.concat(`* ${product.title} - ${parseCurrency(product.price)} \n`), ``)
    .concat(`\nTotal: ${parseCurrency(cart.reduce((total,product)=> total + product.price, 0))}`);
  }, [cart]);
  return (
    <AnimateSharedLayout>
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
            as={motion.img}
            cursor="pointer"
            layoutId={product.image}
            alt={product.title}
            src={product.image} 
            maxHeight={128} 
            objectFit="cover" 
            onClick={() => setSelectedImage(product.image)}
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
      <AnimatePresence>
      {Boolean(cart.length) && (
      <Flex 
        as={motion.div}
        initial={{scale:0}}
        animate={{scale: 1}}
        exit={{scale: 0}}
        position="sticky" 
        bottom={4} 
        alignItems="center" 
        justifyContent="center"
      >
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
      </AnimatePresence>
    </Stack>
    <AnimatePresence>
      {selectedImage && (
        <Flex 
          key="backdrop" 
          alignItems="center" 
          as={motion.div} 
          backgroundColor="rgba(0,0,0,0.5)"
          justifyContent="center"
          layoutId={selectedImage}
          top={0}
          left={0}
          position="fixed"
          width="100%"
          onClick={() => setSelectedImage(null)}
        >
          <Image src={selectedImage} key="image" />
        </Flex>
      )}
    </AnimatePresence>
    </AnimateSharedLayout>
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