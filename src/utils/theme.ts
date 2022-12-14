import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "rgb(29, 155, 240)",
        },
        secondary: {
            main: '#FFFFFF'
        },
        action: {
            // doesnt apply (atleast to buttons)
            //disabledOpacity: 0.5,
            disabled: "",
            disabledBackground: "",
        }
    },
    typography: {
        button: {
            textTransform: "none",
        }
    }
})