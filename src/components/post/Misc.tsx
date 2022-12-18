import { Stack, Avatar, Box, Typography } from "@mui/material"

import React, { MouseEvent } from "react"

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

interface ParsedContent {
    type: "text" | "@" | "#",
    text: string,
}

const parseContent = (raw: string): ParsedContent[] => {
    const mentions = raw.match(/\B\@\w+/g);
    if (!mentions) return [{ type: "text", text: raw }];

    const result: ParsedContent[] = [];
    let lastIndex = 0;
    for (const mention of mentions) {
        const i = raw.search(mention);
        const text = raw.substring(lastIndex, i);
        lastIndex = i + mention.length;
        result.push({
            type: "text",
            text: text,
        });
        result.push({
            type: "@",
            text: mention,
        })
    }
    result.push({
        type: "text",
        text: raw.substring(lastIndex),
    })

    return result;
}

export const PostContent = ({ 
    raw,
    isThread,
    onOpen
} : { 
    raw: string,
    isThread?: boolean,
    onOpen: (url: string) => void,
}) => {
    const images = raw.match(/(https?:\/\/.*\.(?:png|jpg))/);
    raw = raw.replaceAll(/(https?:\/\/.*\.(?:png|jpg))/g, "");
    const image = images ? images[0] : undefined;

    const parsedContent = parseContent(raw);

    const handleOpenProfile = (e: MouseEvent<HTMLElement>, username: string) => {
        e.stopPropagation();
        onOpen(`/profile/${username}`);
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
                {parsedContent.map((entry, key) => (
                    <React.Fragment key={key}>
                        {entry.type === "text" && <span> {entry.text} </span>}
                        {entry.type === "@" && 
                            <Typography 
                                display="inline-flex" 
                                color="text.secondary"
                                fontSize="inherit"
                                onClick={(e: MouseEvent<HTMLElement>) => handleOpenProfile(e, entry.text.replace("@", ""))} 
                            > {entry.text} </Typography>
                        }
                    </React.Fragment>
                ))}
            </Box>

            {image && 
                <Box pr={2} mt={2}>
                    <img
                        src={`${image}`}
                        title="image"
                        style={{ maxWidth: "100%", borderRadius: 20, border: "1px solid grey" }}
                        loading="lazy"
                    />
                </Box>
            }
        </>
    )
}