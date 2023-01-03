import { GetServerSideProps, type NextPage } from "next";
import { getServerAuthSession } from "server/common/get-server-auth-session";

import { MainLayout } from "components/Layouts";
import Feed from "../components/Feed";

const Home: NextPage = () => {

    return (
        <MainLayout title="Home">
            <Feed />
        </MainLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);

    if (!session?.user?.profileID) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            }
        }
    }

    return {
        props: {},
    }
}
export default Home;