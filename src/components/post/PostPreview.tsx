import { Box, IconButton, Typography, Stack } from "@mui/material";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { useRouter } from "next/router";
import type { MouseEvent } from 'react';
import type { Post, Profile } from "@prisma/client";

import { PostContent, ConnectedAvatar } from "./Misc";
import { trpc } from "utils/trpc";
import { useSession } from "next-auth/react";
import { DisplayNameHorizontal } from "components/Misc";

import { getCreatedTime } from "./Post";

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
    const { mutate: deletePostMutate } = trpc.post.delete.useMutation();

    const handleSavePost = (e: MouseEvent<HTMLElement> ,type: "like" | "retweet") => {
        e.stopPropagation();
        // could do it on server
        if (sessionData?.user?.profileID === owner.id) return;
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
        if (!sessionData?.user?.isAdmin) return;
        deletePostMutate({ id: id }, { onSuccess: () => {
            queryUtils.post.invalidate();
        }})
    }

    return (
        <Box
            pl={2} pr={2}
            onClick={handleOpenPost}
            sx={{
                borderBottom: hasReply? "none" : "1px solid grey",
                cursor: "pointer",
            }}
        >
            <Stack direction="column">
                <Stack direction="row">
                    <ConnectedAvatar
                        username={owner.username}
                        image={owner.image}
                        linePos={((parentOwner && "top") || (hasReply && "bottom")) || undefined}
                    />

                    <Stack direction="column" width="100%">
                        <Stack direction="row" alignItems="center">
                            <DisplayNameHorizontal
                                displayName={owner.displayName}
                                username={owner.username}
                                verified={owner.verified}
                            />

                            <Typography>{getCreatedTime(createdAt)}</Typography>

                            <IconButton sx={{ ml: "auto" }} onClick={handleOpenOptions} >
                                {sessionData?.user?.isAdmin 
                                    ? <DeleteForeverIcon fontSize="small" color="error" />
                                    : <MoreHorizIcon fontSize="small" />
                                }
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