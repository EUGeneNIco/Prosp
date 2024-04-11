
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

export function Chat() {

    function handleSend() {
        console.log('Sending')
    }

    return (
        <Card style={{ margin: '0 auto' }} className="w-[350px]">
            <CardHeader>
                <div className="flex w-full ">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>Member</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                        <CardTitle className="mb-1">Eugene</CardTitle>
                        <CardDescription>euge2u@yahoo.com</CardDescription>
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
        </Card>
    )
}
