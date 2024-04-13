import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { TOKEN_NAME } from "./Globals";
import { useNavigate } from "react-router-dom";

type AuthResponse = {
    token: string
}

export function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleToken(data: AuthResponse) {
        // console.log('data', data);

        localStorage.setItem(TOKEN_NAME, data.token);
        localStorage.setItem('user', JSON.stringify(data));
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // Prevent default form submission behavior
        const loginData = {
            username: username,
            password: password
        }
        // console.log('login:', loginData);

        fetch('https://localhost:7036/api/auth', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data: AuthResponse) => {
                handleToken(data);
                navigate('/', { replace: true });
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    }

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            onChange={(e) => setUsername(e.target.value)} value={username}
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                                Forgot your password?
                            </Link> */}
                        </div>
                        <Input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            id="password"
                            type="password"
                            required />
                    </div>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
