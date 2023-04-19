import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";

import { useEffect, useState } from "react";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";

import { Avatar, DisplayNameVertical } from "./Misc";

const useDebounce = (value: string, delay: number) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounced(value);
        }, delay);
        return () => clearTimeout(timeout);
    });
    return debounced;
};

export const SearchField = ({
    onSearch,
}: {
    onSearch?: (value: string) => void;
}) => {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [showResults, setShowResults] = useState(false);

    const debouncedValue = useDebounce(search, 750);
    const { isLoading, data: users } =
        trpc.profile.findMany.useQuery(debouncedValue);

    const handleOpenResult = (username: string) => {
        setSearch("");
        setShowResults(false);
        router.push(`/profile/${username}`);
    };

    const handleSearch = () => {
        if (!onSearch) return;
        onSearch(search);
        setShowResults(false);
    };

    return (
        <ClickAwayListener onClickAway={() => setShowResults(false)}>
            <Box position="relative" width={1} onClick={() => setShowResults(true)}>
                <TextField
                    name="twitter-search"
                    variant="outlined"
                    placeholder="Search Twitter"
                    fullWidth
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setShowResults(true);
                    }}
                    onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        handleSearch();
                    }}
                    sx={{
                        "& fieldset": {
                            borderRadius: 10,
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="disabled" />
                            </InputAdornment>
                        ),
                        endAdornment: search !== "" && (
                            <InputAdornment position="end">
                                <IconButton
                                    color="info"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSearch("");
                                        setShowResults(false);
                                        onSearch && onSearch("");
                                    }}
                                >
                                    <CancelIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {showResults && (
                    <Stack
                        direction="column"
                        position="absolute"
                        width={1}
                        minHeight={200}
                        maxHeight={400}
                        mt={1}
                        borderRadius={3}
                        bgcolor="background.grey2"
                        boxShadow="rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                    >
                        <Typography mb={2} pt={2} pl={2}>
                            {search === ""
                                ? "Recent:"
                                : `Results for ${search}:`}
                        </Typography>

                        {isLoading && (
                            <Box alignSelf="center">
                                <CircularProgress />
                            </Box>
                        )}

                        <Stack direction="column" overflow="auto">
                            {users?.map((user) => (
                                <Stack
                                    key={user.username}
                                    direction="row"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenResult(user.username)
                                    }}
                                    sx={{
                                        p: 1,
                                        "&:hover": {
                                            cursor: "pointer",
                                            bgcolor: (t) =>
                                                t.palette.background.hover,
                                        },
                                    }}
                                >
                                    <Avatar
                                        username={user.username}
                                        image={user.image}
                                        sx={{ mr: 1.5 }}
                                    />
                                    <DisplayNameVertical
                                        username={user.username}
                                        displayName={user.displayName}
                                        verified={user.verified}
                                    />
                                </Stack>
                            ))}
                        </Stack>
                    </Stack>
                )}
            </Box>
        </ClickAwayListener>
    );
};
