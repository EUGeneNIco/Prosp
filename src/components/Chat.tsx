
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import { Member } from "./MemberList";
import { Skeleton } from "@/components/ui/skeleton";

export function Chat() {
    const { id } = useParams();
    const [userData, setUserData] = useState<Member>({ id: 0, name: '', role: '', email: '', isOnline: false });
    const [fetchFinished, setFetchFinished] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:7036/api/users/' + id);

                if (!response.ok) throw new Error('Failed fetching...');

                const jsonData = await response.json();
                setUserData(jsonData);
                setFetchFinished(true);
                // console.log('Fetching finished', jsonData);
            } catch (error) {
                console.log('Error', error);
            }
        };

        fetchData();
    }, [id])

    function handleSend() {
        console.log('Sending')
    }

    return (
        <>
            {fetchFinished ? (
                <Card style={{ margin: '0 auto' }} className="w-[350px]">
                    <CardHeader>
                        <div className="flex w-full ">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>Member</AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                                <CardTitle className="mb-1">{userData.name}</CardTitle>
                                <CardDescription>{userData.email}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardFooter>
                        <form className="flex w-full items-center space-x-2">
                            <div className="flex-col space-y-1.5">
                                <Input id="name" placeholder="Type here..." />
                            </div>
                            <div className="space-y-1.5">
                                <Button type="button" onClick={handleSend}><Send className="h-4 w-4" /></Button>
                            </div>
                        </form>
                    </CardFooter>
                </Card>) : (
                <Card style={{ margin: '0 auto', height: '150px' }} className="w-[350px]">
                    <div className="flex items-center space-x-4 p-5">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                </Card>
            )}
        </>
    )
}
