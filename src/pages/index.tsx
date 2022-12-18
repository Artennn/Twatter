import { GetServerSideProps, type NextPage } from "next";
import { getSession } from "next-auth/react";

import { Box } from "@mui/material";
import SideBar from "../components/SideBar";
import Feed from "../components/Feed";
import Trending from "../components/Trending";

const Home: NextPage = () => {

  return (
    <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }} >
      <SideBar />
      <Feed />
      <Trending />
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session?.user?.profileID) {    
      return {
        redirect: {
            destination: "/login",
            permanent: false,
        }
      }
  }
  return {
    props: {},
  }
}

export default Home;