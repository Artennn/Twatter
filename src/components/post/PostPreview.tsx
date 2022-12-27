import { Box, IconButton, Typography, Stack, SvgIcon } from "@mui/material";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { useRouter } from "next/router";
import { MouseEvent } from 'react';
import { Post, Profile } from "@prisma/client";

import { PostContent, ProfileAvatar } from "./Misc";
import { trpc } from "utils/trpc";
import { useSession } from "next-auth/react";

const getHour = (date: Date) => {
    const text = date.toLocaleString();
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
                    <ProfileAvatar
                        image={owner.image}
                        linePos={((parentOwner && "top") || (hasReply && "bottom")) || undefined}
                        handleOpenProfile={handleOpenProfile}
                    />

                    <Stack direction="column" width="100%">
                        <Stack direction="row" alignItems="center">
                            <Typography> {owner.displayName} </Typography>
                            {owner.verified && 
                                <SvgIcon fontSize="small" sx={{ ml: 0.5, color: "text.secondary" }}>
                                    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"></path>
                                </SvgIcon>
                            }
                            <Typography ml={1} mr={1} color="text.dark" onClick={handleOpenProfile}>
                                {"@" + owner.username}
                            </Typography>
                            <Typography> {getHour(createdAt)} </Typography>

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