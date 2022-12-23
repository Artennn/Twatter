import React, { MouseEvent } from "react"
import Link from "next/link"

import { Stack, Avatar, Box, Typography } from "@mui/material"

import { parseContent, ParsedContent } from "utils/contentParser"

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

export const PostContent = ({ 
    raw,
    isThread,
    imageAsLink,
    onOpen
} : { 
    raw: string,
    isThread?: boolean,
    imageAsLink?: boolean,
    onOpen: (url: string) => void,
}) => {
    const parsedContent = parseContent(raw);
    const withoutImages = parsedContent.filter(entry => entry.type !== "image");
    const images = parsedContent.filter(entry => entry.type === "image");

    const displayedEntries = imageAsLink? parsedContent : withoutImages;

    const handleOpen = (e: MouseEvent<HTMLElement>, entry: ParsedContent) => {
        e.stopPropagation();
        entry.type === "@" && onOpen(`/profile/${entry.text.replace("@", "")}`);
        entry.type === "#" && onOpen(`/hashtag/${entry.text.replace("#", "")}`);
    }

    return (
        <>
            <Box 
                display="inline" 
                whiteSpace="pre-line" 
                mt={isThread? 2 : 0}
                fontSize={isThread? 24 : 16}
                sx={{ wordWrap: "break-word" }} 
            >
                {displayedEntries.map((entry, key) => (
                    <React.Fragment key={key}>
                        {entry.type === "text" && <span> {entry.text} </span>}

                        {((entry.type === "@") || (entry.type === "#")) && 
                            <Typography 
                                display="inline-flex" 
                                color="text.secondary"
                                fontSize="inherit"
                                onClick={(e: MouseEvent<HTMLElement>) => handleOpen(e, entry)} 
                            >
                                {entry.text} 
                            </Typography>
                        }

                        {((entry.type === "link") || (entry.type === "image")) && 
                            <Link href={entry.text} > {entry.text} </Link>
                        }
                    </React.Fragment>
                ))}
            </Box>

            {(!imageAsLink && images[0]) && 
                <Box pr={2} mt={2}>
                    <img
                        src={images[0].text}
                        title="image"
                        style={{ maxWidth: "100%", borderRadius: 20, border: "1px solid grey" }}
                        loading="lazy"
                    />
                </Box>
            }
        </>
    )
}