import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Member } from "./Dashboard";
export function Block({ id, name, job }: Member) {

    function handleClick() {
        console.log(`Clicked ${id}`);
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{job}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Content</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={handleClick}>Message</Button>
            </CardFooter>
        </Card>
    )
}
