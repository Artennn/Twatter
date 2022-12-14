import { GetServerSideProps, type NextPage } from "next";
import { getSession, signIn } from "next-auth/react";

import { Login } from "../components/auth/Login";

const LoginPage: NextPage = ({}) => {

    const handleLogin = (data: Login) => {
        const { email, password } = data;
        // TODO show errors
        signIn('credentials', {
            email,
            password,
        });
    }

    return (
        <Login handleLogin={handleLogin} />
    )
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);
    const isAuthed = session?.user.authID;
    const hasProfile = session?.user.profileID? true : false;

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