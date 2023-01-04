import { useSession } from "next-auth/react";
import LoginPage from "pages/login";
import RegisterPage from "pages/register";

const AuthGuard = ({ children }: { children: JSX.Element }) => {
    const { data, status } = useSession();

    if (status === "loading") return <>Loading</>;

    if (status === "unauthenticated") return <LoginPage />;

    if (!data?.user?.profileID) return <RegisterPage authed={true} />;

    return children;
};
export default AuthGuard;