import { GetServerSideProps, type NextPage } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { getServerAuthSession } from "server/common/get-server-auth-session";

import { Login } from "../components/auth/Login";

const LoginPage: NextPage = ({}) => {
    const router = useRouter();
    const [errorCode, setErrorCode] = useState(0);

    const handleLogin = async (data: Login) => {
        const { email, password } = data;
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });
        if (result?.ok) return router.push("/");
        result?.status && setErrorCode(result?.status);
    }

    return (
        <Login errorCode={errorCode} handleLogin={handleLogin} />
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