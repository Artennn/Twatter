import {
    useMediaQuery,
    Box,
    Typography,
    Stack,
    IconButton,
    Button,
} from "@mui/material";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { SearchField } from "./Search";
import { ConnectedAvatar } from "./post/Misc";
import { DisplayNameVertical } from "./Misc";

import { trpc } from "utils/trpc";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const trends = [
    ["Politics · Trending ", "#POTUS", "197K Tweets"],
    ["Technology · Trending ", "#iPhone", "250K Tweets"],
    ["Space · Trending ", "#SpaceX", "75K Tweets"],
    ["Trending ", "#Montanta", "150K Tweets"],
    ["Technology · Trending ", "#twatter", "100K Tweets"],
];

const Trending = () => {
    const shouldBeShown = useMediaQuery("(min-width:1270px)");
    const ref = useRef<HTMLDivElement>();
    const [offset, setOffset] = useState(0);

    const router = useRouter();
    const { mutate: followMutate } = trpc.follows.follow.useMutation();
    const { data: whoToFollow, refetch } = trpc.profile.getMany.useQuery({
        usernames: ["nasa", "tesla", "elonmusk"],
    });

    const handleResize = () => {
        // simulate twitters 3rd column behaviour
        // if content is taller than the screen height  
        // set top property to the negative diffrence of heights
        // if not set it to 0
        if (!ref.current) return; 
        const diff = ref.current.clientHeight - window.innerHeight;
        setOffset(diff > 0 ? -diff : 0);
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        handleResize();
    }, [whoToFollow])

    const handleFollow = (id: number) => {
        followMutate(id, {
            onSuccess: () => {
                refetch();
            },
        });
    };

    if (!shouldBeShown) return null;

    return (
        <Box ref={ref} sx={{
            width: 400,
            height: 1,
            minHeight: "100vh",
            position: "sticky",
            top: offset,
            p: 2,
            pl: 4,
            pt: 0,
        }}>
            {!router.route.includes("/search") && (
                <Box
                    position="sticky"
                    bgcolor="background.default"
                    top={0}
                    pt={1}
                    pb={1}
                    zIndex={1}
                >
                    <SearchField />
                </Box>
            )}

            <Stack direction="column" spacing={2} mt={2}>
                <Box bgcolor="background.grey2" borderRadius={5} pb={2}>
                    <Typography fontSize={20} fontWeight="bold" p={2}>
                        Trends for you
                    </Typography>

                    {trends.map((trend, key) => (
                        <Box
                            width="100%"
                            key={key}
                            p={2}
                            pb={1.5}
                            pt={1.5}
                            sx={{
                                cursor: "pointer",
                                "&:hover": {
                                    bgcolor: "background.hover",
                                },
                            }}
                        >
                            <Stack direction="column" position="relative">
                            <Typography variant="subtitle2" color="text.dark"> {trend[0]} </Typography>
                            <Typography variant="subtitle1"> {trend[1]} </Typography>
                            <Typography variant="subtitle2" color="text.dark"> {trend[2]} </Typography>
                            <IconButton sx={{ position: "absolute", top: 1, right: 1}}>
                                    <MoreHorizIcon />
                                </IconButton>
                            </Stack>
                        </Box>
                    ))}
                </Box>

                <Box bgcolor="background.grey2" borderRadius={5} pb={2}>
                    <Typography fontSize={20} fontWeight="bold" p={2}>
                        Who to follow
                    </Typography>

                    {whoToFollow?.map((user, key) => (
                        <Box
                            width="100%"
                            key={key}
                            p={2}
                            pb={1.5}
                            pt={1.5}
                            sx={{
                                cursor: "pointer",
                                "&:hover": {
                                    bgcolor: "background.hover",
                                },
                            }}
                            onClick={() =>
                                router.push(`/profile/${user.username}`)
                            }
                        >
                            <Stack direction="row" position="relative">
                                <ConnectedAvatar
                                    username={user.username}
                                    image={user.image}
                                />

                                <DisplayNameVertical
                                    username={user.username}
                                    displayName={user.displayName}
                                    verified={user.verified}
                                    sx={{ mt: "auto", ml: 1 }}
                                />

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    disabled={user.followers.length > 0}
                                    sx={{ borderRadius: 5, m: "auto", mr: 0 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFollow(user.id);
                                    }}
                                >
                                    {user.followers.length > 0
                                        ? "Following"
                                        : "Follow"}
                                </Button>
                            </Stack>
                        </Box>
                    ))}
                </Box>
            </Stack>
        </Box>
    );
};
export default Trending;
