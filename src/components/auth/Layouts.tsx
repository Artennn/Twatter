import { Box } from "@mui/material"
import Head from "next/head"

export const AuthLayout = ({ 
    children,
    title,
}: { 
    children: JSX.Element | JSX.Element[],
    title?: string,
}) => {
    return (
        <>
            <Head>
                <title>{title ? `${title} / Twatter` : "Twatter"}</title>
            </Head>

            <Box component="main" bgcolor="black">
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
        </>
    )
}