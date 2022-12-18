import { Box, CircularProgress } from "@mui/material";

import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";

import NavBar from "components/NavBar";
import SideBar from "components/SideBar";
import Trending from "components/Trending";

import NewPost from "components/post/NewPost";
import PostPreview from "components/post/PostPreview";
import Post from "components/post/Post";

import { trpc } from "utils/trpc";

const PostPage: NextPage<{ postID: string }> = ({ postID }) => {
    const { data: post, isLoading } = trpc.post.get.useQuery({ id: postID });
    const { data: parentPost } = trpc.post.get.useQuery({ id: post?.parentPostID as string }, { enabled: !!post?.parentPostID });
    const { data: comments } = trpc.post.getMany.useQuery({ parentID: postID });

    if (isLoading) return (
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }} >
            <SideBar />
            <Box width="100%" maxWidth={600} height="100%" bgcolor="common.black">
                <CircularProgress />
            </Box>
            <Trending />
        </Box>
    )

    if (!post) return (
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }} >
            <SideBar />
            <Box width="100%" maxWidth={600} height="100%" bgcolor="common.black">
                No post found
            </Box>
            <Trending />
        </Box>
    )

    return (
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }} >
            <SideBar />
            <Box width="100%" maxWidth={600} height="100%" bgcolor="common.black">
                <NavBar goBack title="Tweet" />
                { parentPost &&
                    <PostPreview data={parentPost} hasReply />
                }
                <Post data={post} parentOwner={parentPost?.owner} />
                <NewPost parentID={postID} />
                {comments?.map((comment, key) => (
                    <PostPreview key={key} data={comment} />
                ))}
            </Box>
            <Trending />
        </Box>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);
    const { id } = ctx.query;

    if (typeof id !== "string") {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        } 
    }

    if (!session?.user?.profileID) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            }
        }
    }
    return {
        props: {
            postID: id,
        },
    }
}

export default PostPage;