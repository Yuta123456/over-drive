"use client";
import { redirectToAuthCodeFlow } from "@/utils";
import { Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <main>
      <Box w="100%" display="flex" justifyContent="center">
        <Button onClick={() => router.push("/create")}>
          プレイリストを作成
        </Button>
      </Box>
    </main>
  );
}
