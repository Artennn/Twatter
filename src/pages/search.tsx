import type { GetServerSideProps, NextPage } from "next";
import { getServerAuthSession } from "server/common/get-server-auth-session";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import { MainLayout } from "components/Layouts";
import NavBar from "components/NavBar";
import { SearchField } from "components/Search";
import ProfilePreview from "components/ProfilePreview";

import { trpc } from "utils/trpc";
import { useState } from "react";

const SearchPage: NextPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const {
        isLoading,
        data: profiles,
        refetch,
    } = trpc.profile.findMany.useQuery(searchQuery);

    return (
        <MainLayout title={`on Twatter`}>
            <NavBar goBack>
                <Box width={1} ml={3} mr={2}>
                    <SearchField onSearch={(value) => setSearchQuery(value)} />
                </Box>
            </NavBar>

            <Stack direction="column">
                {isLoading && (
                    <Box alignSelf="center" mt={3}>
                        <CircularProgress />
                    </Box>
                )}

                {profiles?.map((profile) => (
                    <ProfilePreview
                        key={profile.username}
                        profile={profile}
                        isFollowing={profile.followers.length > 0}
                        onFollowToggle={() => refetch()}
                    />
                ))}
            </Stack>
        </MainLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);
    if (!session?.user?.profileID) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};

export default SearchPage;
