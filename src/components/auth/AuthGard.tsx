import { useSession } from "next-auth/react";
import LoginPage from "pages/login";
import RegisterPage from "pages/register";


const AuthGuard = ({ pageProps, children } : { pageProps: any, children: JSX.Element }) => {
    const { data, status } = useSession();

    if (status === "loading") return <>Loading</>;
    
    if (status === "unauthenticated") return <LoginPage />

    return children;
}
export default AuthGuard;