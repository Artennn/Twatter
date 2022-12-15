import { Box } from "@mui/material";
import { trpc } from "../utils/trpc";
import PostPreview from "./post/PostPreview";
import NewPost from "./post/NewPost";
import NavBar from "./NavBar";

const Feed = () => {
    const { data: allPosts } = trpc.post.getMany.useQuery({}, { refetchInterval: 5 * 1000 });

    return (
        <Box width="100%" maxWidth={600} height="100%" bgcolor="common.black">
            <NavBar />
            <NewPost />
            {allPosts?.map(post => (
                <PostPreview data={post} />
            ))}
        </Box>
    )
}
export default Feed;