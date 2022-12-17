import { Avatar, Box, Button, IconButton, Tab, Tabs, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Profile as ProfileDB } from "@prisma/client";

import NotificationsIcon from '@mui/icons-material/Notifications';
import PendingIcon from '@mui/icons-material/Pending';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { useRouter } from "next/router";
import { ProfileTab } from "pages/profile/[...all]";

const Profile = ({
    profile,
    isOwner,
    following,
    handleFollow,
    tab
}: {
    profile: ProfileDB & {
        _count: {
            following: number,
            followers: number,
        },
    },
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

            <Stack direction="column" p={2} mt={3} color="grey">
                <Typography fontSize={20} fontWeight={700} color="white"> {profile.displayName} </Typography>
                <Typography variant="subtitle2" mb={2}> {"@" + profile.username} </Typography>

                <Stack direction="row">
                    <CalendarMonthIcon fontSize="small"/>
                    <Typography variant="subtitle2" ml={1}>Joined June 2009</Typography>
                </Stack>

                <Stack direction="row" mt={1}>
                    <Typography variant="subtitle2" color="white" ml={0.5}> {profile._count.following} </Typography>
                    <Typography variant="subtitle2" ml={0.75}> Following </Typography>
                    <Typography variant="subtitle2" color="white" ml={2}> {profile._count.followers} </Typography>
                    <Typography variant="subtitle2" ml={0.75}> Followers </Typography>
                </Stack>
            </Stack>

            <Tabs centered value={tab} sx={{
                "& .MuiTabs-flexContainer": {
                    justifyContent: "space-around",
                }
            }}>
                <Tab value="" label="Tweets" component="a" onClick={() => handleSwitchTab("")} />
                <Tab value="replies" label="Replies" component="a" onClick={() => handleSwitchTab("replies")} />
                <Tab value="retweets" label="Retweets" component="a" onClick={() => handleSwitchTab("retweets")} />
                <Tab value="likes" label="Likes" component="a" onClick={() => handleSwitchTab("likes")} />
            </Tabs>
        </Stack>
    )
}
export default Profile;