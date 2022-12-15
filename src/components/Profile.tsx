import { useState } from "react";

import { Avatar, Box, Button, IconButton, Tab, Tabs, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Profile } from "@prisma/client";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PendingIcon from '@mui/icons-material/Pending';

import { useRouter } from "next/router";
import { ProfileTab } from "pages/profile/[...all]";

const Profile = ({
    profile,
    isOwner,
    following,
    handleFollow,
    tab
}: {
    profile: Profile,
    isOwner?: boolean,
    following?: boolean,
    handleFollow: () => void,
    tab: ProfileTab,
}) => {
    const router = useRouter();

    const handleSwitchTab = (tab: ProfileTab) => {
        router.push(`/profile/${profile.username}/${tab}`);
    }

    return (
        <Stack direction="column" border="1px grey solid" borderTop="none">
            <Box height={170}>
                <img
                    src={"https://pbs.twimg.com/profile_banners/44196397/1576183471/600x200"}
                    style={{ height: "100%", width: "100%", objectFit: "cover" }}
                    title="profile-picture"
                />
            </Box>

            <Stack direction="row" p={1} position="relative">
                <Box position="absolute" left={20} top={-50}>

                    <Avatar
                        src={profile.image}
                        sx={{
                            width: 130,
                            height: 130,
                        }}
                    />
                </Box>

                <IconButton sx={{ ml: "auto" }}>
                    <NotificationsIcon />
                </IconButton>
                <IconButton>
                    <PendingIcon />
                </IconButton>
                {isOwner 
                    ? <Button variant="outlined">
                        Edytuj profil
                    </Button>
                    : <Button variant="outlined" onClick={handleFollow} >
                        {following ? "Following" : "Follow"}
                    </Button>
                }
            </Stack>

            <Stack direction="column" p={2} mt={3}>
                <Typography fontSize={20} fontWeight={700} > {profile.displayName} </Typography>
                <Typography variant="subtitle2" mb={2}> {"@" + profile.username} </Typography>

                <Typography>Joined June 2009</Typography>
            </Stack>

            <Tabs centered value={tab} sx={{
                "& .MuiTabs-flexContainer": {
                    justifyContent: "space-around",
                }
            }}>
                <Tab value="" label="Tweets" component="a" onClick={() => handleSwitchTab("")} />
                <Tab value="replies" label="Replies" component="a" onClick={() => handleSwitchTab("replies")} />
                <Tab value="media" label="Media" component="a" onClick={() => handleSwitchTab("media")} />
                <Tab value="likes" label="Likes" component="a" onClick={() => handleSwitchTab("likes")} />
            </Tabs>
        </Stack>
    )
}
export default Profile;