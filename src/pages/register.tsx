import { useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";
import { getServerAuthSession } from "server/common/get-server-auth-session";

import { NewLoginMethod, type LoginMethod } from "../components/auth/NewLoginMethod";
import { type Profile, NewProfile } from "../components/auth/NewProfile";
import { AuthLayout } from "components/auth/Layouts";

import { Backdrop, CircularProgress } from "@mui/material";

const RegisterPage: NextPage<{ authed: boolean }> = ({ authed }) => {
    const router = useRouter();
    const profileMutation = trpc.auth.createProfile.useMutation();
    const methodMutation = trpc.auth.createLoginMethod.useMutation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const handleCreateLoginMethod = async (data: LoginMethod) => {
        const { email, password } = data;
        setLoading(true);
        setError(undefined);
        methodMutation.mutate(data, {
            onSuccess: async () => {
                const result = await signIn("credentials", {
                    email,
                    password,
                });
                if (result?.ok) return await router.push("/");
                setLoading(false);
                result?.status && setError(result?.status.toString());
            },
            onError: (error) => {
                setLoading(false);
                setError(error.message);
            },
        });
    };

    const handleCreateProfile = async (data: Profile) => {
        setLoading(true);
        setError(undefined);
        profileMutation.mutate(data, {
            onSuccess: async () => {
                // force the client session to update
                document.dispatchEvent(new Event("visibilitychange"));
                router.push("/");
            },
            onError: async (error) => {
                setLoading(false);
                setError(error.message);
            },
        });
    };

    if (authed)
        return (
            <AuthLayout title="Create new Profile">
                <NewProfile handleCreate={handleCreateProfile} error={error} />
                <Backdrop open={loading || false}>
                    <CircularProgress size={75} />
                </Backdrop>
            </AuthLayout>
        );

    return (
        <AuthLayout title="Register">
            <NewLoginMethod
                handleCreate={handleCreateLoginMethod}
                error={error}
            />
            <Backdrop open={loading || false}>
                <CircularProgress size={75} />
            </Backdrop>
        </AuthLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);
    const authed = session?.user?.id? true : false;

    if (session?.user?.profileID) {    
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