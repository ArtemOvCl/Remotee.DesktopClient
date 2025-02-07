import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';

const App: React.FC = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        // Створення з'єднання з SignalR хабом
        const hubConnection = new HubConnectionBuilder()
            .withUrl("http://localhost:5085/sessionHub") // Адреса хабу
            .build();

        hubConnection
            .start()
            .then(() => {
                console.log("Connected to SignalR Hub");
            })
            .catch(err => console.error("Error while starting connection: ", err));

        // Підключення до методу хабу, наприклад, для отримання ID комп'ютера
        hubConnection.on("GetComputerConnectionId", (computerConnectionId: string) => {
            setMessage(`Computer Connection ID: ${computerConnectionId}`);
        });

        // Зберігаємо підключення
        setConnection(hubConnection);

        // Очищення підключення при виході з компонента
        return () => {
            if (hubConnection) {
                hubConnection.stop();
            }
        };
    }, []);

    // Створення сесії
    const createSession = async () => {
        if (connection) {
            try {
                const newSessionId = await connection.invoke("CreateSession");
                setSessionId(newSessionId);
            } catch (error) {
                console.error("Error creating session:", error);
            }
        }
    };

    // Приєднання до сесії
    const joinSession = async (sessionId: string) => {
        if (connection) {
            try {
                const success = await connection.invoke("JoinSession", sessionId);
                if (success) {
                    console.log(`Successfully joined session: ${sessionId}`);
                } else {
                    console.log(`Failed to join session: ${sessionId}`);
                }
            } catch (error) {
                console.error("Error joining session:", error);
            }
        }
    };

    return (
        <div>
            <h1>SignalR WebSocket Test</h1>
            <p>{message}</p>
            <button onClick={createSession}>Create Session</button>
            {sessionId && <p>Session ID: {sessionId}</p>}
            <button onClick={() => sessionId && joinSession(sessionId)}>Join Session</button>
        </div>
    );
}

export default App;
