import { MemberList } from "./MemberList.tsx";

export function Dashboard() {
    return (
        <>
            <h3 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Chats</h3>
            <MemberList />
        </>
    );
}