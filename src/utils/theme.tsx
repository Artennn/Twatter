import { createTheme } from "@mui/material";
import GlobalStylesMUI from "@mui/material/GlobalStyles";

const styles = {
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
}

export const GlobalStyles = () => <GlobalStylesMUI styles={styles} />;

declare module '@mui/material/styles' {
    export interface TypeText {
        dark: string,
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
    }
})