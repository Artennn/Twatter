import { Box, IconButton, Typography, Stack, TextField, Button, CircularProgress, Skeleton } from "@mui/material";

import ImageIcon from '@mui/icons-material/Image';
import GifBoxIcon from '@mui/icons-material/GifBox';
import ListIcon from '@mui/icons-material/List';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { ChangeEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

import { PostContent } from "./Misc";
import { Avatar } from "components/Misc";

const POST_MAX_LENGTH = 255;

const NewPost = ({ parentID } : { parentID?: string }) => {
    const { data: sessionData } = useSession();
    const queryUtils = trpc.useContext();
    
    const { data: profile } = trpc.profile.get.useQuery({ id: sessionData?.user?.profileID }, { enabled: !!sessionData?.user?.profileID })
    const postMutation = trpc.post.create.useMutation();

    const [content, setContent] = useState("");
    const length = content.length;

    const handleSetContent = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (value.length > POST_MAX_LENGTH) return;
        setContent(value);
    }

    const handleCreatePost = () => {
        const newPost = {
            content,
            parentID,
        }
        postMutation.mutate(newPost, {
            onSuccess: () => {
                queryUtils.post.invalidate();
                setContent("");
            },
        });
    }

    return (
        <Box p={2} sx={{ borderBottom: "1px grey solid" }}>
            <Stack direction="column">
                
                <Stack direction="row">
                    {profile
                        ? <Avatar username={profile.username} image={profile.image} />
                        : <Skeleton variant="circular" sx={{ minWidth: 48, height: 48 }} />
                    }

                    <Box width="100%" ml={2}>
                        <Box position="relative">
                            <TextField
                                variant="outlined" 
                                multiline 
                                fullWidth
                                spellCheck={false}
                                placeholder={parentID? "Tweet your reply" : "What's happening?"}
                                value={content}
                                onChange={handleSetContent}
                                inputProps={{ 
                                    style: { 
                                        lineHeight: 1.5,
                                        color: length > 0? "transparent" : "inherit",
                                        caretColor: "white"
                                    }
                                }}
                                sx={{ zIndex: 1}}
                            />
                            <Box position="absolute" top={0} p="16.5px 14px" zIndex={0}>
                                <PostContent raw={content} imageAsLink onOpen={() => undefined} />
                            </Box>
                        </Box>

                        <Stack direction="row" marginTop={1}>
                            <IconButton>
                                <ImageIcon fontSize="small" />
                            </IconButton>
                            <IconButton>
                                <GifBoxIcon fontSize="small" />
                            </IconButton>
                            <IconButton>
                                <ListIcon fontSize="small" />
                            </IconButton>
                            <IconButton>
                                <EmojiEmotionsIcon fontSize="small" />
                            </IconButton>
                            <IconButton>
                                <PendingActionsIcon fontSize="small" />
                            </IconButton>
                            
                            <CircularProgress 
                                size={20} 
                                variant="determinate" 
                                value={length / POST_MAX_LENGTH * 100} 
                                sx={{ alignSelf: "center", ml: "auto" }} 
                            />

                            {length > 0 && <Typography ml={1} variant="subtitle2" alignSelf="center">{`${length}/${POST_MAX_LENGTH}`}</Typography>}

                            <IconButton>
                                <AddCircleIcon fontSize="small" />
                            </IconButton>
                            <Button 
                                variant="contained" 
                                size="small" 
                                sx={{ 
                                    borderRadius: 5, 
                                    color: "white", 
                                    ":disabled": {
                                        opacity: 0.5,
                                        backgroundColor: "primary.main",
                                        color: "white",
                                    } 
                                }}
                                disabled={length < 1}
                                onClick={handleCreatePost}
                            >
                                {parentID? "Reply" : "Tweet"}
                            </Button>
                        </Stack>
                    </Box>
                </Stack>

            </Stack>
        </Box>
    )
}
export default NewPost;