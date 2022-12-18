import { Box, IconButton, Typography, Stack } from "@mui/material";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PublishIcon from '@mui/icons-material/Publish';

import { useRouter } from "next/router";
import { MouseEvent } from 'react';
import { Post, Profile } from "@prisma/client";

import { PostContent, ProfileAvatar } from "./Misc";
import { trpc } from "utils/trpc";
import { useSession } from "next-auth/react";

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
        _count: {
            comments: number,
        }
    },
    parentOwner?: Profile,
    hasReply?: boolean
}) => {
    const router = useRouter();
    const { data: sessionData } = useSession();
    const { id, content, likes, retweets, createdAt, owner } = data;

    const handleOpenProfile = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        router.push(`/profile/${owner.username}`);
    }

    const handleOpenParentProfile = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        parentOwner && router.push(`/profile/${parentOwner.username}`);
    }

    const handleOpenPost = () => {
        router.push(`/post/${data.id}`)
    }

    const queryUtils = trpc.useContext();
    const { comments } = data._count;
    const { data: savedPostData } = trpc.savedPost.getByPost.useQuery(id);
    const { mutate: savedPostsMutate } = trpc.savedPost.set.useMutation();

    const handleSavePost = (e: MouseEvent<HTMLElement> ,type: "like" | "retweet") => {
        e.stopPropagation();
        // could do it on server
        if (sessionData?.user.profileID === owner.id) return;
        savedPostsMutate({
            postID: id,
            like: (type === "like")? !savedPostData?.like : undefined,
            retweet: (type === "retweet")? !savedPostData?.retweet : undefined,
        }, { onSuccess: () => {
            queryUtils.post.invalidate();
            queryUtils.savedPost.invalidate();
        }})
    }

    const handleOpenOptions = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
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
                            <Typography ml={1} mr={1} color="text.dark" onClick={handleOpenProfile}>
                                {"@" + owner.username}
                            </Typography>
                            <Typography> {getHour(createdAt)} </Typography>

                            <IconButton sx={{ ml: "auto" }} onClick={handleOpenOptions} >
                                <MoreHorizIcon fontSize="small" />
                            </IconButton>
                        </Stack>

                        {parentOwner &&
                            <Stack direction="row">
                                <Typography color="text.dark"> Replying to </Typography>
                                <Typography color="text.secondary" ml={0.5} onClick={handleOpenParentProfile}>
                                    {"@" + parentOwner.username}
                                </Typography>
                            </Stack>
                        }

                        <PostContent raw={content} onOpen={url => router.push(url)} />

                        <Stack direction="row" spacing="auto" mr={4} mb={1} mt={1}>
                            <Stack direction="row" alignItems="center">
                                <IconButton>
                                    <ChatBubbleIcon fontSize="small" />
                                </IconButton>
                                <Typography> {comments} </Typography>
                            </Stack>

                            <Stack direction="row" alignItems="center">
                                <IconButton
                                    color={savedPostData?.retweet && "success" || "default"}
                                    onClick={(e: MouseEvent<HTMLElement>) => handleSavePost(e, "retweet")} 
                                >
                                    <RepeatIcon fontSize="small" />
                                </IconButton>
                                <Typography> {retweets} </Typography>
                            </Stack>

                            <Stack direction="row" alignItems="center">
                                <IconButton
                                    color={savedPostData?.like && "error" || "default"}
                                    onClick={(e: MouseEvent<HTMLElement>) => handleSavePost(e, "like")} 
                                >
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