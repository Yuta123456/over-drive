"use client";

import { FC } from "react";
import { Box, Button, Container, Heading } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import Image from "next/image";
import logo from "../../../public/logo.svg";
import { useRouter } from "next/navigation";
type HeaderProps = {
  title: string;
};
export const Header: FC<HeaderProps> = ({ title }) => {
  const router = useRouter();
  return (
    <Container
      h={100}
      bg="green.600"
      display={"flex"}
      alignItems={"center"}
      maxW="100%"
    >
      <Box
        w="60vw"
        margin={"auto"}
        display="flex"
        alignItems={"center"}
        onClick={() => router.push("/")}
      >
        <Image src={logo} alt="over drive" width={100} color="white" />
        <Heading color={"black"} marginLeft={3}>
          {title}
        </Heading>
      </Box>
    </Container>
  );
};
