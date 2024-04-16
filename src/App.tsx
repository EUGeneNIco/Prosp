import { ThemeProvider } from "@/components/them-provider.tsx";
import { Dashboard } from "./components/Dashboard";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { useEffect, useState } from "react";
import { LogLevel, HubConnectionBuilder } from '@microsoft/signalr';
import { TOKEN_NAME } from "./components/Globals";
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "./components/ui/toaster";

function App() {
  const wrapper = {
    maxWidth: '50rem',
    margin: '0 auto'
  }

  // const [conn, setConnection] = useState<HubConnection>();
  // const [onlineToast, setOnlineToast] = useState();
  const { toast } = useToast()
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(0);
  const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);

  const userIsOnline = async (name: string, userId: number) => {
    try {
      userId = +userId;
      console.log('connecting to hub...', name, userId);
      const conn = new HubConnectionBuilder()
        .withUrl("https://localhost:7036/chat")
        .configureLogging(LogLevel.Information)
        .build();

      conn.on("UserIsOnline", (name, msg) => {
        console.log("mgs: ", msg);
        toast({
          title: `${msg}`,
          // description: "Friday, February 10, 2023 at 5:57 PM",
          // action: (
          //   <ToastAction altText="Chat now">Chat</ToastAction>
          // ),
        })
      });

      conn.on("UserIdIsOnline", (name, msg) => {
        setOnlineUserIds((prevIds) => {
          if (prevIds.includes(msg))
            return prevIds;
          return [...prevIds, msg];
        });
      });

      await conn.start();
      await conn.invoke("UserIsOnline", { name });
      await conn.invoke("UserIdIsOnline", { userId });

      // setConnection(conn);
    } catch (error) {
      console.log(error);
    }
  }

  function handleLogin(tokenData: string) {
    const payLoad = JSON.parse(window.atob(tokenData.split('.')[1]));
    setUserId(payLoad.UserGuid)
    setUsername(payLoad.unique_name);
  }

  function getUserIdFromLocalStorage() {
    const tokenFromLocalStorage = localStorage.getItem(TOKEN_NAME);
    if (!tokenFromLocalStorage) {
      return
    }

    const payLoad = JSON.parse(window.atob(tokenFromLocalStorage.split('.')[1]));

    // setUserId(payLoad.UserGuid);
    setUsername(payLoad.unique_name);
  }

  useEffect(() => {
    getUserIdFromLocalStorage();
    console.log('do we have username? ', username, userId);
    if (username && userId > 0)
      userIsOnline(username, userId);
  }, [username, userId])

  return (

    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <NavBar username={username} />
        <div style={wrapper}>
          <Routes>
            <Route path="/" element={<Dashboard onlineUserIds={onlineUserIds} />} />
            <Route path="/chat/:id" Component={Chat} />
            <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          </Routes>
        </div>
      </Router>
      <Toaster />
    </ThemeProvider >
  )
}

export default App
