import { MouseEvent } from "react";
import { useRouter } from "next/router";

import { Stack, Typography, Button } from "@mui/material";

import { Avatar, DisplayNameVertical } from "./Misc";

import { trpc } from "utils/trpc";

import { Profile } from "@prisma/client";

const ProfilePreview = ({
    profile,
    isFollowing,
    isOwner,
}: {
    profile: Profile,
    isFollowing: boolean,
    isOwner?: boolean,
}) => {
    const router = useRouter();
    const queryUtils = trpc.useContext();
    const { mutate: followMutate } = trpc.follows.follow.useMutation();
    const { mutate: unFollowMutate } = trpc.follows.unFollow.useMutation();

    const handleToggleFollow = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        const mutate = isFollowing ? unFollowMutate : followMutate;
        mutate(profile.id, {
            onSuccess: () => {
                queryUtils.follows.invalidate();
            }
        })
    }

    return (
        <Stack
            direction="row" 
            p={2} pt={1.5} pb={1.5}
            onClick={() => router.push(`/profile/${profile.username}`)}
            sx={{
                cursor: "pointer",
                "&:hover": {
                    bgcolor: "background.hover",
                }
            }}
        >
            <Avatar username={profile.username} image={profile.image} sx={{ mr: 1.5 }} />

            <Stack direction="column" width="100%">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <DisplayNameVertical
                        displayName={profile.displayName}
                        username={profile.username}
                        verified={profile.verified}
                    />

                    <Button 
                        variant="contained" 
                        color="secondary" 
                        sx={{ borderRadius: 5}}
                        disabled={isOwner}
                        onClick={handleToggleFollow}
                    >
                        {isFollowing? "Unfollow" : "Follow"}
                    </Button>
                </Stack>

                <Typography fontSize={15} pt={0.5}> {profile.description} </Typography>
            </Stack>
        </Stack>
    )
}
export default ProfilePreview;