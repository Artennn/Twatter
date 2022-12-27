import { useMediaQuery, Box, Typography, Stack, IconButton } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const trends = [
    ["Technology · Trending ", "#AppleSucks", "197K Tweets"],
    ["Technology · Trending ", "#TwitterFiles", "197K Tweets"],
    ["Technology · Trending ", "#MyslcieDanymi", "197K Tweets"],
    ["Technology · Trending ", "#ElonMuskIs...", "197K Tweets"],
]

const Trending = () => {
    //const shouldBeShown = useMediaQuery('(min-width:1000px)');
    const shouldBeShown = useMediaQuery('(min-width:1270px)');

    if (!shouldBeShown) return <Box sx={{ flexGrow: 1, width: 350 }} bgcolor="rgb(0, 0, 0)" />

    return (
        <Box sx={{ flexGrow: 1}} minHeight="100vh" p={2} pl={4} bgcolor="rgb(0, 0, 0)">
            <Box 
                position="sticky"
                top={16}
                width={350} 
                bgcolor="background.grey2" 
                borderRadius={2}
                mt={10}
                pb={3}
            >
                <Typography fontSize={20} fontWeight={500} p={2}>Trends for you</Typography>
                {trends.map((trend, key) => (
                    <Box 
                        width="100%" 
                        key={key} 
                        p={2} 
                        pb={1.5} pt={1.5} 
                        sx={{ 
                            cursor: "pointer", 
                            "&:hover": {
                                bgcolor: "background.hover",
                            }
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
        </Box>
    )
}
export default Trending;