import { GetServerSideProps, NextPage } from "next";
import { getServerAuthSession } from "server/common/get-server-auth-session";

import { Box, CircularProgress, Typography } from "@mui/material";

import { MainLayout } from "components/Layouts";
import NavBar from "components/NavBar";

import NewPost from "components/post/NewPost";
import PostPreview from "components/post/PostPreview";
import Post from "components/post/Post";

import { trpc } from "utils/trpc";

const PostPage: NextPage<{ postID: string }> = ({ postID }) => {
    const { data: post, isLoading } = trpc.post.get.useQuery({ id: postID });
    const { data: parentPost } = trpc.post.get.useQuery({ id: post?.parentPostID as string }, { enabled: !!post?.parentPostID });
    const { data: comments } = trpc.post.getMany.useQuery({ parentID: postID });

    if (isLoading) return (
        <MainLayout>
            <NavBar goBack title="Tweet" />
            <Box textAlign="center" mt={10}>
                <CircularProgress size={75} />
            </Box>
        </MainLayout>
    )

    if (!post) return (
        <MainLayout>
            <NavBar goBack title="Tweet" />
            <Box textAlign="center" mt={10}>
                <Typography> {"This post doesn't exist :("} </Typography>
            </Box>
        </MainLayout>
    )

    return (
        <MainLayout>
            <NavBar goBack title="Tweet" />
            <>
                { parentPost &&
                    <PostPreview data={parentPost} hasReply />
                }

                <Post data={post} parentOwner={parentPost?.owner} />

                <NewPost parentID={postID} />

                {comments?.map((comment, key) => (
                    <PostPreview key={key} data={comment} />
                ))}
            </>
        </MainLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);
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