import { GetServerSideProps, type NextPage } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

import { NewLoginMethod, LoginMethod } from "../components/auth/NewLoginMethod";
import { Account, NewAccount } from "../components/auth/NewAccount";

import { trpc } from "../utils/trpc";

const RegisterPage: NextPage<{ authed: boolean }> = ({ authed }) => {
    const router = useRouter();
    const accountMutation = trpc.auth.createAccount.useMutation();
    const methodMutation = trpc.auth.createLoginMethod.useMutation();

    const handleCreateLoginMethod = async (data: LoginMethod) => {
        const { email, password } = data;
        methodMutation.mutate(data, {
            onSuccess: () => signIn("credentials", {
                email,
                password,
            })
        });
    }

    const handleCreateAccount = async (data: Account) => {
        accountMutation.mutate(data, {
            onSuccess: () => router.push("/"),
        });
    }

    if (authed) return (
        <NewAccount handleCreate={handleCreateAccount} />
    )

    return (
        <NewLoginMethod handleCreate={handleCreateLoginMethod} />
    )
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);
    const authed = session?.user.authID? true : false;

    if (session?.user.profileID) {    
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }

    return {
        props: {
            authed,
        },
    }
}
export default RegisterPage;