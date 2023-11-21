import { FC } from "react";
import { Box, Button, Container } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
type HeaderProps = {
  title: string;
};
export const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <Container
      h={100}
      bg="teal.400"
      display={"flex"}
      alignItems={"center"}
      maxW="100%"
    >
      <Box w="60vw" margin={"auto"} color="white" display="flex">
        <Text fontSize={24}>{title}</Text>
      </Box>
    </Container>
  );
};
