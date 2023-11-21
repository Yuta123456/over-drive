import { FC } from "react";
import { Box, Button, Container, Heading } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import Image from "next/image";
import logo from "../../../public/logo.svg";
type HeaderProps = {
  title: string;
};
export const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <Container
      h={100}
      bg="green.600"
      display={"flex"}
      alignItems={"center"}
      maxW="100%"
    >
      <Box w="60vw" margin={"auto"} display="flex" alignItems={"center"}>
        <Image src={logo} alt="over drive" width={100} color="white" />
        <Heading color={"black"}>{title}</Heading>
      </Box>
    </Container>
  );
};
