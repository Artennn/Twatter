import { IconButton, Stack, Typography } from "@mui/material";

import FlareIcon from '@mui/icons-material/Flare';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useRouter } from "next/router";

const NavBar = ({
    goBack,
    title,
    subtitle,
}: {
    goBack?: boolean,
    title?: string,
    subtitle?: string,
}) => {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    }

    return (
        <Stack direction="row"
            sx={{ 
                position: "sticky",
                bgcolor: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(12px)",
                borderRight: "1px solid grey",
                borderLeft: "1px solid grey",
                p: 1,
                top: 0,
                zIndex: 3 
            }}
        >
            {goBack
                ? <IconButton sx={{ mt: "auto", mb: "auto" }} onClick={handleGoBack} >
                    <ArrowBackIcon />
                </IconButton>
                : <Typography variant="h6" fontWeight={700} sx={{ m: "auto", ml: 0}}> 
                    Home 
                </Typography>
            }
            {goBack
                ? <Stack direction="column" ml={3} alignSelf={subtitle? "auto" : "center"}>
                    <Typography fontSize={20} fontWeight={700}> 
                        {title}
                    </Typography>
                    <Typography variant="subtitle2"> {subtitle} </Typography>
                </Stack>
                : null
            }
            {!goBack
                ? <IconButton>
                    <FlareIcon />
                </IconButton>   
                : null
            }
        </Stack>
    )
}
export default NavBar;