import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

import SearchIcon from "@mui/icons-material/Search";

export const SearchField = () => {
    return (
        <TextField
            variant="outlined"
            placeholder="Search Twitter"
            fullWidth
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
            }}
        />
    );
};
