import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import { Button } from "@mui/material";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  /* const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  ); */

  if (!sessionData?.user) {
    return (
      <>
        <Button onClick={() => signIn()}> Zaloguj sie </Button>
      </>
    )
  }

  return (
    <>
      <pre> { JSON.stringify(sessionData, null, 2) } </pre>
      <Button onClick={() => signOut()}> Wyloguj sie </Button>
    </>
  );
};
export default Home;