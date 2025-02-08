import React from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const App: React.FC = () => {

  const handleConnectSession = async () => {
    try {

      const hubConnection: HubConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:5085/sessionHub")
        .configureLogging(LogLevel.Information)
        .build();

      await hubConnection.start();
      console.log("Connected!");

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h1>Tauri React App - Connecting</h1>
      <button
        onClick={handleConnectSession}
        style={{ fontSize: '1.2rem', padding: '10px 20px' }}
      >
        Connect to hub
      </button>
    </div>
  );
};

export default App;
