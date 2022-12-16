import { Box } from "@mui/material";
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

    const { data: profile } = trpc.profile.get.useQuery({ username: profileName });

    const { data: posts } =  trpc.post.getMany.useQuery({ createdBy: profileName }, { enabled: profileTab === "" });
    const { data: replies } =  trpc.post.getReplies.useQuery({ username: profileName }, { enabled: profileTab === "replies" });
    const { data: media } =  trpc.post.getMany.useQuery({ createdBy: profileName }, { enabled: profileTab === "media" });
    const { data: likes } =  trpc.post.getMany.useQuery({ createdBy: profileName }, { enabled: profileTab === "likes" });

    const { data: isFollowing } = trpc.follows.isFollowing.useQuery({ username: profileName });

    const { mutate: followMutate } = trpc.follows.follow.useMutation();
    const { mutate: unFollowMutate } = trpc.follows.unFollow.useMutation();

    const isOwner = profile?.id === sessionData?.user.profileID;

    //const replies2 = replies?.filter((reply): reply is  => reply.parent !== null);
    console.log({replies});

    const handleFollow = () => {
        if (!profile || isFollowing === undefined) return;
        const mutate = isFollowing ? unFollowMutate : followMutate;
        mutate(profile.id, {
            onSuccess: () => {
                queryUtils.follows.invalidate();
            }
        })
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <SideBar />
            <Box width="100%" maxWidth={600} height="100%" bgcolor="common.black">
                <NavBar goBack title={profile?.displayName} subtitle="12K Tweets" />
                {profile ? (
                    <Profile
                        profile={profile}
                        isOwner={isOwner}
                        following={isFollowing}
                        handleFollow={handleFollow}
                        tab={profileTab}
                    />
                ) : (
                    "No profile found"
                )}

                {profileTab === "" && posts?.map((post, key) => (
                    <PostPreview data={post} key={key} />
                ))}
                
                {profileTab === "replies" && replies?.map((reply, key) => ( 
                    <React.Fragment key={key}>
                        {/* 
                        //@ts-ignore */}
                        <PostPreview data={reply.parent} hasReply />
                        <PostPreview data={reply} parentOwner={reply.owner} />
                    </React.Fragment>
                ))}
            </Box>
            <Trending />
        </Box>
    );
};

const ProfileTabs = [
    "",
    "replies",
    "media",
    "likes",
] as const;

export type ProfileTab = typeof ProfileTabs[number];

const parseLink = (link: string | string[]) => {
    let profileTab: ProfileTab = "";

    if (typeof link === "string") {
        return {
            profileName: link,
            profileTab,
        }
    }
    //@ts-ignore
    if (!link[1] || !ProfileTabs.includes(link[1])) {
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

    if (!session?.user.profileID) {
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
