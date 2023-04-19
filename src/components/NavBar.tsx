import { IconButton, Stack, Tooltip, Typography } from "@mui/material";

import FlareIcon from "@mui/icons-material/Flare";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useRouter } from "next/router";

import type { ReactNode } from "react";

const NavBar = ({
    goBack,
    title,
    subtitle,
    children,
}: {
    goBack?: boolean;
    title?: string;
    subtitle?: string;
    children?: ReactNode,
}) => {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <Stack
            direction="row"
            sx={{
                position: "sticky",
                bgcolor: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(12px)",
                p: 1,
                top: 0,
                zIndex: 3,
            }}
        >
            {goBack ? (
                <IconButton
                    sx={{ mt: "auto", mb: "auto" }}
                    onClick={handleGoBack}
                >
                    <ArrowBackIcon />
                </IconButton>
            ) : (
                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ m: "auto", ml: 0 }}
                >
                    Home
                </Typography>
            )}

            {title ? (
                <Stack
                    direction="column"
                    ml={3}
                    alignSelf={subtitle ? "auto" : "center"}
                >
                    <Typography fontSize={20} fontWeight={700}>
                        {title}
                    </Typography>

                    <Typography variant="subtitle2" color="text.dark">
                        {subtitle}
                    </Typography>
                </Stack>
            ) : null}

            {!goBack ? (
                <Tooltip title="Sort by Recent" placement="bottom" arrow>
                    <IconButton>
                        <FlareIcon />
                    </IconButton>
                </Tooltip>
            ) : null}

            {children}
        </Stack>
    );
};
export default NavBar;
