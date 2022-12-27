import { Box } from "@mui/material"

import SideBar from "./SideBar"
import Trending from "./Trending"

export const MainLayout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    return (
        <Box sx={{ 
            display: "flex", 
            flexDirection: "row", 
            width: "100%" 
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
    )
}