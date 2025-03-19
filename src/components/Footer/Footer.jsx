import { Flex, Box, Text } from "@radix-ui/themes";
import ResponsiveContainer from "../RespContainer";

export default function Footer(){
return (
    <Box asChild style={{background: "hsl(44, 62%, 70%)"}} mt={'auto'}>
      <footer>
        <ResponsiveContainer>
          <Flex 
            justify={'between'}
            py={'3'}
            gapX={'5'}
            gapY={'3'}
            direction={{initial: 'column', sm: 'row'}}
          >
            <Text as="p" align={{initial: 'center'}} size={{initial: '2', xs: '3'}}>YelpCamp is created with ❤️ and hope for our future.</Text>
            <Text as="p" align={{initial: 'center'}}  size={{initial: '2', xs: '3'}}>Copyright &copy; YelpCamp 2025</Text>
          </Flex>
        </ResponsiveContainer>
      </footer>
    </Box>
  );
}