import { Stack, Avatar, Box } from "@mui/material"

import { MouseEvent } from "react"

export const ProfileAvatar = ({ 
    image,
    linePos,
    handleOpenProfile,
} : { 
    image: string
    linePos?: "top" | "bottom",
    handleOpenProfile: (e: MouseEvent<HTMLElement>) => void,
}) => {
    return (
        <Stack direction="column" pr={1}>
            {linePos === "top" &&
                <Box sx={{
                    bgcolor: "grey",
                    height: 8,
                    width: 2,
                    ml: "auto",
                    mr: "auto",
                }} />
            }
            <Avatar
                src={image}
                alt="profile-pic"
                onClick={handleOpenProfile}
                sx={{ height: 48, width: 48, mt: linePos === "top"? 0 : 1 }}
            />
            {linePos === "bottom" &&
                <Box sx={{
                    bgcolor: "grey",
                    flexGrow: 1,
                    width: 2,
                    ml: "auto",
                    mr: "auto",
                }} />
            }
        </Stack>
    )
}