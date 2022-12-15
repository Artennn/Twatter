import { useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";

const Trending = () => {
    const shouldBeShown = useMediaQuery('(min-width:1000px)');

    return (
        <Box width={350} sx={{ flexGrow: 1}}>
            Trending
        </Box>
    )
}
export default Trending;