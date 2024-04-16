import { MemberList } from "./MemberList.tsx";

interface Props {
    onlineUserIds: number[]
}

export function Dashboard(props: Props) {
    const { onlineUserIds } = props;
    return (
        <>
            <h3 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Chats</h3>
            <MemberList onlineUserIds={onlineUserIds} />
        </>
    );
}