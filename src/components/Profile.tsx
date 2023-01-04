import { Avatar, Box, Stack, Button, IconButton, Tab, Tabs, Typography, SvgIcon } from "@mui/material";

import NotificationsIcon from '@mui/icons-material/Notifications';
import PendingIcon from '@mui/icons-material/Pending';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { Link } from "./Misc";
import { EditProfileDialog } from "./dialogs/EditProfile";

import { useRouter } from "next/router";
import { useState } from "react";

import type { ProfileTab } from "pages/profile/[...all]";
import type { Profile as ProfileDB } from "@prisma/client";

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
    const [showDialog, setShowDialog] = useState(false);

    const handleSwitchTab = (tab: ProfileTab) => {
        router.push(`/profile/${profile.username}/${tab}`, undefined, { scroll: false });
    }

    const handleToggleDialog = () => {
        setShowDialog(!showDialog);
    }

    return (
        <Stack direction="column" border="1px grey solid" borderTop="none">
            <Box height={170}>
                <img
                    src={profile.background || "https://pbs.twimg.com/profile_banners/44196397/1576183471/600x200"}
                    alt="background"
                    title="background"
                    style={{ height: "100%", width: "100%", objectFit: "cover" }}
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
                    ? <Button variant="outlined" onClick={handleToggleDialog}>
                        Edytuj profil
                    </Button>
                    : <Button variant="outlined" onClick={handleFollow} >
                        {following ? "Following" : "Follow"}
                    </Button>
                }
            </Stack>

            {showDialog && <EditProfileDialog profile={profile} onClose={handleToggleDialog} />}

            <Stack direction="column" p={2} mt={3} color="text.dark">
                <Stack direction="row">
                    <Typography fontSize={20} fontWeight={700} color="white"> {profile.displayName} </Typography>
                    {profile.verified && 
                        <SvgIcon fontSize="small" sx={{ m: "auto", ml: 0.5, color: "text.secondary" }}>
                            <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"></path>
                        </SvgIcon>
                    }
                </Stack>
                <Typography variant="subtitle2" mb={2}> {"@" + profile.username} </Typography>
                
                {/* TODO: change to parsed text */}
                {profile.description &&
                    <Typography fontSize={15} color="white" mb={1.5} > {profile.description} </Typography>
                }

                <Stack direction="row">
                    <CalendarMonthIcon fontSize="small"/>
                    <Typography variant="subtitle2" ml={1}>Joined June 2009</Typography>
                </Stack>

                <Stack direction="row" mt={1}>
                    <Link href={`/profile/${profile.username}/following`} >
                        <Typography variant="subtitle2" color="white" ml={0.5}> {profile._count.following} </Typography>
                        <Typography variant="subtitle2" color="text.dark" ml={0.75}> Following </Typography>
                    </Link>

                    <Link href={`/profile/${profile.username}/followers`} >
                        <Typography variant="subtitle2" color="white" ml={2}> {profile._count.followers} </Typography>
                        <Typography variant="subtitle2" color="text.dark" ml={0.75}> Followers </Typography>
                    </Link>
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