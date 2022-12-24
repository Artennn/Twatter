import { Box } from "@mui/material"

export const AuthLayout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    return (
        <Box bgcolor="black">
            <Box sx={{
                display: 'flex',
                height: '100vh',
                bgcolor: "background.grey1",
            }}>
                <Box sx={{
                    position: 'relative',
                    margin: 'auto',
                    width: 600,
                    minHeight: 600,
                    background: "black",
                    borderRadius: 5,
                    p: 2,
                    textAlign: 'center',
                }}>
                    { children }
                </Box>
            </Box>
        </Box>
    )
}