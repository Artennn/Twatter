import { Box } from "@mui/material";
import { trpc } from "../utils/trpc";
import PostPreview from "./post/PostPreview";
import NewPost from "./post/NewPost";
import NavBar from "./NavBar";
import React from "react";

const Feed = () => {
    //const { data: myPosts } = trpc.post.getMany.useQuery({ }, { refetchInterval: 5 * 1000 });
    const { data: postsByFollowing } = trpc.post.getFeed.useQuery();

    return (
        <Box width="100%" maxWidth={600} height="100%" bgcolor="common.black">
            <NavBar />
            <NewPost />
            {postsByFollowing?.map((post, key) => (
                <React.Fragment key={key}>
                    {post.parent 
                        ? <>
                            <PostPreview data={post.parent} hasReply />
                            <PostPreview data={post} parentOwner={post.parent.owner} />
                        </> 
                        : <PostPreview data={post} />
                    }
                </React.Fragment>     
            ))}
        </Box>
    )
}
export default Feed;