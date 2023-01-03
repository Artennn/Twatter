import { Box } from "@mui/material";
import Head from "next/head";

import SideBar from "./SideBar";
import Trending from "./Trending";

export const MainLayout = ({
    children,
    title,
}: {
    children: JSX.Element | JSX.Element[];
    title?: string;
}) => {
    return (
        <>
            <Head>
                <title>{title ? `${title} / Twatter` : "Twatter"}</title>
            </Head>

            <Box
                component="main"
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                <SideBar />

                <Box
                    width="100%"
                    maxWidth={600}
                    minHeight="100vh"
                    height="100%"
                    bgcolor="common.black"
                    borderLeft="1px solid grey"
                    borderRight="1px solid grey"
                >
                    {children}
                </Box>

                <Trending />
            </Box>
        </>
    );
};
