import { useMediaQuery, Box, Typography, Stack, IconButton } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const trends = [
    ["Technology · Trending ", "iPhone", "197K Tweets"],
    ["Technology · Trending ", "iPhone", "197K Tweets"],
    ["Technology · Trending ", "iPhone", "197K Tweets"],
    ["Technology · Trending ", "iPhone", "197K Tweets"],
]

const Trending = () => {
    //const shouldBeShown = useMediaQuery('(min-width:1000px)');
    const shouldBeShown = useMediaQuery('(min-width:1270px)');
    console.log({shouldBeShown})

    if (!shouldBeShown) return <Box sx={{ flexGrow: 1, width: 350 }} bgcolor="rgb(0, 0, 0)" />

    return (
        <Box sx={{ flexGrow: 1}} p={2} pl={4} bgcolor="rgb(0, 0, 0)">
            <Box 
                position="sticky"
                top={16}
                width={350} 
                bgcolor="rgb(22, 24, 28)" 
                borderRadius={2}
                mt={10}
            >
                <Typography fontSize={20} fontWeight={500} p={2}>Trends for you</Typography>
                {trends.map(trend => (
                    <Box width="100%" p={2} pb={1.5} pt={1.5} sx={{ cursor: "pointer", "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.03)",
                    }}}>
                        <Stack direction="column" position="relative">
                            <Typography variant="subtitle2" color="text.secondary">Trending</Typography>
                            <Typography variant="subtitle1">iPhone</Typography>
                            <Typography variant="subtitle2" color="text.secondary">196K Tweets</Typography>
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