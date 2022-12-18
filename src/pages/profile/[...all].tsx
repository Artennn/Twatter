import { Box, CircularProgress } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";

import NavBar from "components/NavBar";
import PostPreview from "components/post/PostPreview";
import Profile from "components/Profile";
import SideBar from "components/SideBar";
import Trending from "components/Trending";

import { trpc } from "utils/trpc";
import React from "react";


const ProfilePage: NextPage<{ profileName: string, profileTab: ProfileTab }> = ({ profileName, profileTab }) => {
    const queryUtils = trpc.useContext();
    const { data: sessionData } = useSession();

    const { data: profile, isLoading } = trpc.profile.get.useQuery({ username: profileName });

    // not disabled because of posts.length, should prob make a separate query
    const { data: posts } =  trpc.post.getMany.useQuery({ createdBy: profileName });
    const { data: replies } =  trpc.post.getReplies.useQuery({ username: profileName }, { enabled: profileTab === "replies" });
    const { data: retweeted } =  trpc.post.getSaved.useQuery({ username: profileName, retweeted: true }, { enabled: profileTab === "retweets" });
    const { data: liked } =  trpc.post.getSaved.useQuery({ username: profileName, liked: true }, { enabled: profileTab === "likes" });

    const { data: isFollowing } = trpc.follows.isFollowing.useQuery({ username: profileName });

    const { mutate: followMutate } = trpc.follows.follow.useMutation();
    const { mutate: unFollowMutate } = trpc.follows.unFollow.useMutation();

    const isOwner = profile?.id === sessionData?.user?.profileID;

    const handleFollow = () => {
        if (!profile || isFollowing === undefined) return;
        const mutate = isFollowing ? unFollowMutate : followMutate;
        mutate(profile.id, {
            onSuccess: () => {
                queryUtils.follows.invalidate();
                queryUtils.profile.invalidate();
            }
        })
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <SideBar />
            <Box width="100%" maxWidth={600} height="100%" bgcolor="common.black">
                <NavBar goBack title={profile?.displayName} subtitle={`${posts?.length} Tweets`} />

                {isLoading && <CircularProgress />}
                {!isLoading && !profile && "No profile found :("}
                {!isLoading && profile && (
                    <Profile
                        profile={profile}
                        isOwner={isOwner}
                        following={isFollowing}
                        handleFollow={handleFollow}
                        tab={profileTab}
                    />
                )}

                {profileTab === "" && posts?.map((post, key) => (
                    <PostPreview data={post} key={key} />
                ))}
                
                {profileTab === "replies" && replies?.map((reply, key) => ( 
                    <React.Fragment key={key}>
                        {reply.parent && (
                            <>
                                <PostPreview data={reply.parent} hasReply />
                                <PostPreview data={reply} parentOwner={reply.owner} />
                            </>
                        )}
                    </React.Fragment>
                ))}

                {profileTab === "retweets" && retweeted?.map((post, key) => (
                    <PostPreview data={post} key={key} />
                ))}

                {profileTab === "likes" && liked?.map((post, key) => (
                    <PostPreview data={post} key={key} />
                ))}
            </Box>
            <Trending />
        </Box>
    );
};

const ProfileTabs = [
    "",
    "replies",
    "retweets",
    "likes",
] as const;

export type ProfileTab = typeof ProfileTabs[number];

const parseLink = (link: string | string[]) => {
    const profileTab: ProfileTab = "";

    if (typeof link === "string") {
        return {
            profileName: link,
            profileTab,
        }
    }
    if (!link[1] || !ProfileTabs.includes(link[1] as ProfileTab)) {
        return {
            profileName: link[0] as string,
            profileTab,
        }
    }
    return {
        profileName: link[0],
        profileTab: link[1] as ProfileTab,
    }
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);
    const { profileName, profileTab } = parseLink(ctx.query.all as string | string[]); 

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
            profileName,
            profileTab,
        },
    }
}

export default ProfilePage;
