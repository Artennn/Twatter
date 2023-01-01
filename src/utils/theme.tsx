import { createTheme } from "@mui/material";

declare module '@mui/material/styles' {
    export interface TypeText {
        dark: string,
    }
    export interface TypeBackground {
        grey1: string,
        grey2: string,
        hover: string,
    }
}

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "rgb(29, 155, 240)",
        },
        secondary: {
            main: '#FFFFFF'
        },
        text: {
            secondary: "rgb(29, 155, 240)",
            dark: "rgb(113, 118, 123)",
        },
        background: {
            grey1: "rgba(91, 112, 131, 0.4)",
            grey2: "rgb(28 30 38)", // 28 30 38
            hover: "rgba(255, 255, 255, 0.07)",
        },
        action: {
            // doesnt apply (atleast to buttons)
            //disabledOpacity: 0.5,
            //disabled: "",
            //disabledBackground: "",
        }
    },
    typography: {
        button: {
            textTransform: "none",
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: (theme) =>  ({
                html: {
                    overflowY: "scroll",
                },
                "::-webkit-scrollbar": {
                    backgroundColor: "#202324",
                    color: "#aba499",
                },
                "::-webkit-scrollbar-corner": {
                    backgroundColor: "#181a1b",
                },
                "::-webkit-scrollbar-thumb": {
                    backgroundColor: "#454a4d",
                },
                "a": {
                    color: theme.palette.text.secondary
                },
            }),
        }
    }
})