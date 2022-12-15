import { Box, IconButton, Typography, Stack } from "@mui/material";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PublishIcon from '@mui/icons-material/Publish';

import { useRouter } from "next/router";

import { MouseEvent } from 'react';
import { ProfileAvatar } from "./Misc";
import { Post, Profile } from "@prisma/client";

const Post = ({ 
    data,
    parentOwner,
}: { 
    data: Post & {
        owner: Profile,
    },
    parentOwner?: Profile,
}) => {
    const router = useRouter();
    let { content, likes, retweets, createdAt, owner, parentPostID } = data;

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
        <Box pl={2} pr={2} sx={{ border: "1px grey solid", borderTop: "none", cursor: "pointer" }} onClick={handleOpenPost}>
            <Stack direction="column">
                <Stack direction="row">
                    <ProfileAvatar 
                        image={owner.image}
                        linePos={(parentPostID && "top") || undefined}
                        handleOpenProfile={handleOpenProfile}
                    />

                    <Stack direction="column" mt="auto">
                        <Typography> {owner.displayName} </Typography>
                        <Typography color="grey" onClick={handleOpenProfile}>
                            {"@" + owner.username}
                        </Typography>
                    </Stack>

                    <IconButton sx={{ m: "auto", mr: 0 }}>
                        <MoreHorizIcon fontSize="small" />
                    </IconButton>
                </Stack>

                {parentOwner &&
                    <Stack direction="row" marginTop={1}>
                        <Typography color="grey"> Replying to </Typography>
                        <Typography color="grey" ml={1} onClick={handleOpenProfile}>
                            {"@" + parentOwner?.username}
                        </Typography>
                    </Stack>
                }

                <Typography mt={1} whiteSpace="pre-line">
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

                <Typography color="grey" mt={2} mb={2}> 10:22 PM · Dec 14, 2022 </Typography>

                <Stack direction="row" spacing={3} pt={2} pb={2} borderTop="1px solid grey" borderBottom="1px solid grey">
                    <Typography>{retweets} Retweets</Typography>
                    <Typography>{5} Quote Tweets</Typography>
                    <Typography>{likes} Likes</Typography>
                </Stack>

                <Stack direction="row" spacing="auto" pt={2} pb={2} pl={4} pr={4}>
                    <IconButton>
                        <ChatBubbleIcon fontSize="small" />
                    </IconButton>
                    <IconButton>
                        <RepeatIcon fontSize="small" />
                    </IconButton>
                    <IconButton>
                        <FavoriteIcon fontSize="small" />
                    </IconButton>
                    <IconButton>
                        <PublishIcon fontSize="small" />
                    </IconButton>
                </Stack>

            </Stack>
        </Box>
    )
}
export default Post;