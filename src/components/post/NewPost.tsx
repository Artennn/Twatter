import { Avatar, Box, IconButton, Typography, Stack, TextField, Button, CircularProgress } from "@mui/material";

import FlareIcon from '@mui/icons-material/Flare';

import ImageIcon from '@mui/icons-material/Image';
import GifBoxIcon from '@mui/icons-material/GifBox';
import ListIcon from '@mui/icons-material/List';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { ChangeEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

const POST_MAX_LENGTH = 100;

const NewPost = ({ parentID } : { parentID?: string }) => {
    const { data: sessionData } = useSession();
    const queryUtils = trpc.useContext();
    
    const { data: profile } = trpc.profile.get.useQuery({ id: sessionData?.user.profileID })
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
        <Box p={2} sx={{ border: "1px grey solid", borderTop: "none", }}>
            <Stack direction="column">
                
                <Stack direction="row">
                    <Avatar sx={{ width: 48, height: 48, mr: 2 }} src={profile?.image} />
                    <Box width="100%">
                        <TextField 
                            variant="outlined" 
                            multiline 
                            fullWidth 
                            placeholder={parentID? "Tweet your reply" : "What's happening?"}
                            value={content}
                            onChange={handleSetContent}
                        />
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