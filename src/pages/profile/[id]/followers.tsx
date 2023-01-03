import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { getServerAuthSession } from "server/common/get-server-auth-session";

import { Tab, Tabs } from "@mui/material";

import { MainLayout } from "components/Layouts";
import NavBar from "components/NavBar";
import ProfilePreview from "components/ProfilePreview";

import { trpc } from "utils/trpc";

import { MouseEvent } from "react";

const FollowersPage: NextPage<{ profileName: string }> = ({ profileName }) => {
    const router = useRouter();
    const { data: sessionData } = useSession();

    const { data: profile } = trpc.profile.get.useQuery({ username: profileName });
    const { data: followers } = trpc.follows.getFollowers.useQuery({ username: profileName });

    const handleSwitchTab = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        router.push(`/profile/${profile?.username}/following`);
    }

    return (
        <MainLayout title={`People following ${profile?.displayName}`}>
            <NavBar goBack title={profile?.displayName} subtitle={`@${profile?.username}`} />
            
            <Tabs centered value="followers" sx={{
                borderBottom: "1px solid grey",
                "& .MuiTabs-flexContainer": {
                    justifyContent: "space-around",
                }
            }}>
                <Tab value="followers" label="Followers" />
                <Tab value="following" label="Following" onClick={handleSwitchTab} />
            </Tabs>

            <>
                {followers?.map((follower, key) => (
                    <ProfilePreview 
                        key={key} 
                        profile={follower}
                        isFollowing={follower.isFollowing}
                        isOwner={follower.id === sessionData?.user?.profileID} 
                    />
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
            profileName: id,
        },
    }
}

export default FollowersPage;