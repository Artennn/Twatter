import { Avatar, Badge, Box, ButtonBase, IconButton, Skeleton, Stack, SvgIcon, Typography, useMediaQuery } from "@mui/material";

import LogoutIcon from '@mui/icons-material/Logout';

import HomeIcon from '@mui/icons-material/Home';
import TagIcon from '@mui/icons-material/Tag';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ViewListIcon from '@mui/icons-material/ViewList';
import PersonIcon from '@mui/icons-material/Person';

import { SvgIconComponent } from "@mui/icons-material";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

const ListItem = ({
    name,
    url,
    Icon,
    badge,
    selected,
    onClick
} : {
    name: string,
    url: string,
    Icon: SvgIconComponent,
    badge?: boolean,
    selected?: boolean,
    onClick: (url: string) => void,
}) => {

    return (
        <ButtonBase 
            component="div"
            sx={{ 
                width: "100%", 
                borderRadius: 10,
                justifyContent: "left", 
                mb: 1.5,
                "&:hover": {
                    bgcolor: "rgba(230, 230, 230, 0.1)",
                }
            }}
            onClick={() => onClick(url)}
        >
            <Stack 
                direction="row" 
                p={1} 
                sx={{ opacity: selected? 1.0 : 0.7 }}
            >
                <Badge 
                    variant="dot" 
                    overlap="circular" 
                    color="primary" 
                    invisible={!badge}
                >
                    <Icon fontSize="large" />
                </Badge>

                <Typography 
                    fontSize={20} 
                    fontWeight={selected? 700 : 400}
                    alignSelf="center" 
                    ml={2}
                > 
                    {name} 
                </Typography>
            </Stack>
        </ButtonBase>
    )
}

const SideBar = () => {
    const router = useRouter();
    const { data: sessionData } = useSession(); 
    const { data: userData, isLoading } = trpc.profile.get.useQuery({ id: sessionData?.user.profileID }, { enabled: !!sessionData?.user.profileID });

    const currentPage = router.asPath

    const shouldBeExpanded = useMediaQuery('(min-width:1300px)');

    const handleRedirect = (url: string) => {
        router.push(url);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box marginLeft="auto" width={250} height="100%">
                <Box p={1} height="100%" position="fixed" width={250}>
                    <Stack direction="column" height="100%" >
                        <IconButton sx={{ mr: "auto" }} onClick={() => router.push("/")} >
                            <SvgIcon sx={{ fontSize: 40 }}>
                                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
                            </SvgIcon>
                        </IconButton>

                        <ListItem 
                            name="Home"
                            url="/"
                            Icon={HomeIcon}
                            badge
                            selected={currentPage === "/"}
                            onClick={handleRedirect}
                        />
                        <ListItem 
                            name="Explore"
                            url="/"
                            Icon={TagIcon}
                            selected={currentPage === "/explore"}
                            onClick={handleRedirect}
                        />
                        <ListItem 
                            name="Notifications"
                            url="/"
                            Icon={NotificationsIcon}
                            badge
                            selected={currentPage === "/notifications"}
                            onClick={handleRedirect}
                        />
                        <ListItem 
                            name="Messages"
                            url="/"
                            Icon={EmailIcon}
                            selected={currentPage === "/messages"}
                            onClick={handleRedirect}
                        />
                        <ListItem 
                            name="Bookmarks"
                            url="/"
                            Icon={BookmarkIcon}
                            selected={currentPage === "/bookmarks"}
                            onClick={handleRedirect}
                        />
                        <ListItem 
                            name="Lists"
                            url="/"
                            Icon={ViewListIcon}
                            selected={currentPage === "/lists"}
                            onClick={handleRedirect}
                        />
                        <ListItem 
                            name="Profile"
                            url={`/profile/${userData?.username || ""}`}
                            Icon={PersonIcon}
                            badge
                            selected={currentPage.includes(`/profile/${userData?.username || ""}`)}
                            onClick={handleRedirect}
                        />

                        <Stack direction="row" mt="auto" width="100%">
                            {!isLoading
                                ? <Avatar sx={{ height: 48, width: 48 }} src={userData?.image} />
                                : <Skeleton variant="circular" width={48} height={48} />
                            }

                            <Stack direction="column" ml={2} mr="auto">
                                {!isLoading
                                    ? <Typography> {userData?.displayName} </Typography>
                                    : <Skeleton variant="text" width={100} />
                                }
                                {!isLoading
                                    ? <Typography> {"@" + userData?.username} </Typography>
                                    : <Skeleton variant="text" />
                                }
                            </Stack>

                            <IconButton sx={{ mt: "auto", mb: "auto" }} onClick={() => signOut()}>
                                <LogoutIcon />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}
export default SideBar;