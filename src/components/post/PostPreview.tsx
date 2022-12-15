import { Box, IconButton, Typography, Stack } from "@mui/material";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PublishIcon from '@mui/icons-material/Publish';

import { useRouter } from "next/router";
import { MouseEvent } from 'react';
import { Post, Profile } from "@prisma/client";

import { ProfileAvatar } from "./Misc";

const getHour = (date: Date) => {
    let text = date.toLocaleString();
    return text.substring(text.length - 8, text.length - 3);
}

const PostPreview = ({
    data,
    parentOwner,
    hasReply
}: {
    data: Post & {
        owner: Profile,
    },
    parentOwner?: Profile,
    hasReply?: boolean
}) => {
    const router = useRouter();
    let { content, likes, retweets, createdAt, owner } = data;

    const images = content.match(/(https?:\/\/.*\.(?:png|jpg))/);
    content = content.replaceAll(/(https?:\/\/.*\.(?:png|jpg))/g, "");

    const image = images ? images[0] : undefined;

    const handleOpenProfile = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        router.push(`/profile/${owner.username}`);
    }

    const handleOpenPost = () => {
        router.push(`/post/${data.id}`)
    }

    return (
        <Box
            pl={2} pr={2}
            onClick={handleOpenPost}
            sx={{
                border: "1px grey solid",
                borderBottom: hasReply? "none" : "",
                borderTop: parentOwner? "none" : "",
                cursor: "pointer",
            }}
        >
            <Stack direction="column">
                <Stack direction="row">
                    <ProfileAvatar
                        image={owner.image}
                        linePos={((parentOwner && "top") || (hasReply && "bottom")) || undefined}
                        handleOpenProfile={handleOpenProfile}
                    />

                    <Stack direction="column" width="100%">
                        <Stack direction="row" alignItems="center">
                            <Typography> {owner.displayName} </Typography>
                            <Typography ml={1} mr={1} color="grey" onClick={handleOpenProfile}>
                                {"@" + owner.username}
                            </Typography>
                            <Typography> {getHour(createdAt)} </Typography>

                            <IconButton sx={{ ml: "auto" }}>
                                <MoreHorizIcon fontSize="small" />
                            </IconButton>
                        </Stack>

                        {parentOwner &&
                            <Stack direction="row">
                                <Typography color="grey"> Replying to </Typography>
                                <Typography color="grey" ml={1} onClick={handleOpenProfile}>
                                    {"@" + parentOwner.username}
                                </Typography>
                            </Stack>
                        }

                        <Typography whiteSpace="pre-line">
                            {content}
                        </Typography>

                        {image ?
                            <Box pr={2} mt={2}>
                                <img
                                    src={`${image}`}
                                    title="image"
                                    style={{ maxWidth: "100%", borderRadius: 20, border: "1px solid grey" }}
                                    loading="lazy"
                                />
                            </Box>
                            : null
                        }

                        <Stack direction="row" spacing="auto" mr={4} mb={1} mt={1}>
                            <Stack direction="row" alignItems="center">
                                <IconButton>
                                    <ChatBubbleIcon fontSize="small" />
                                </IconButton>
                                <Typography> {1} </Typography>
                            </Stack>

                            <Stack direction="row" alignItems="center">
                                <IconButton>
                                    <RepeatIcon fontSize="small" />
                                </IconButton>
                                <Typography> {retweets} </Typography>
                            </Stack>

                            <Stack direction="row" alignItems="center">
                                <IconButton>
                                    <FavoriteIcon fontSize="small" />
                                </IconButton>
                                <Typography> {likes} </Typography>
                            </Stack>

                            <IconButton>
                                <PublishIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    )
}
export default PostPreview