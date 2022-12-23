import { useState } from "react";
import { GetServerSideProps, type NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

import { getServerAuthSession } from "server/common/get-server-auth-session";

import { Backdrop, CircularProgress } from "@mui/material";

import { AuthLayout } from "components/auth/Layouts";
import { Login } from "../components/auth/Login";

const LoginPage: NextPage = ({}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const handleLogin = async (data: Login) => {
        const { email, password } = data;
        setLoading(true);
        setError(undefined);
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });
        setLoading(false);
        if (result?.ok) return router.push("/");
        result?.status && setError(result?.status.toString());
    }

    return (
        <AuthLayout>
            <Login handleLogin={handleLogin} error={error} />
            <Backdrop open={loading || false}>
                <CircularProgress size={75} />
            </Backdrop>
        </AuthLayout>
    )
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);
    const isAuthed = session?.user?.authID;
    const hasProfile = session?.user?.profileID? true : false;

    if (hasProfile) {    
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }
    if (isAuthed) {
        return {
            redirect: {
                destination: "/register",
                permanent: false,
            }
        }
    }

    return {
        props: {},
    }
}
export default LoginPage;