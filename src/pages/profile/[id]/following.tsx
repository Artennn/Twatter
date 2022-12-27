import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { getServerAuthSession } from "server/common/get-server-auth-session";

import { Tab, Tabs } from "@mui/material";

import { MainLayout } from "components/Layouts";
import NavBar from "components/NavBar";
import ProfilePreview from "components/ProfilePreview";

import { trpc } from "utils/trpc";

const FollowersPage: NextPage<{ profileName: string }> = ({ profileName }) => {
    const { data: sessionData } = useSession();

    const { data: profile } = trpc.profile.get.useQuery({ username: profileName });
    const { data: following } = trpc.follows.getFollowing.useQuery({ username: profileName });

    return (
        <MainLayout>
            <NavBar goBack title={profile?.displayName} subtitle={`@${profile?.username}`} />
            
            <Tabs centered value="following" sx={{
                borderBottom: "1px solid grey",
                "& .MuiTabs-flexContainer": {
                    justifyContent: "space-around",
                }
            }}>
                <Tab value="followers" label="Followers" component="a" href={`followers`} />
                <Tab value="following" label="Following" component="a" href={`following`} />
            </Tabs>

            <>
                {following?.map((follow, key) => (
                    <ProfilePreview 
                        key={key} 
                        profile={follow}
                        isFollowing={follow.isFollowing}
                        isOwner={follow.id === sessionData?.user?.profileID} 
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