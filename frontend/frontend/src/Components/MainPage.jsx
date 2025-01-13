
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; 
import Componenet1_Navbar from "./Componenet1_Navbar";
import Component2_ChatInput from "./Component2_ChatInput";
import Component3_ChatView from "./Component3_ChatView";

export default function MainPage() {
  const [modelList, setModelList] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [messages, setMessages] = useState([]); 
  const [socket, setSocket] = useState(null);
  const [isRecevingMessage,setIsRecivingMessage] = useState(false);
  const [clientId , setClientId] = useState('');
  const [imageBase64,setImageBase64] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://127.0.0.1:8000/get_model_list");
      const data = await response.json();
      setModelList(data);
      setSelectedModel(data[0]); 
    };
    fetchData();
  }, []);

  useEffect(() => {
    const ClientId = uuidv4(); 
    const ws = new WebSocket(`ws://127.0.0.1:8000/chat/${ClientId}`);
    

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if(message.status=='start'){setIsRecivingMessage(true)}
      else if(message.status=='end'){setIsRecivingMessage(false)}
      else{
        setMessages((prevMessages) => [...prevMessages, message]);
      }

    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(ws);
    setClientId(ClientId)

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="app-container">
      <Componenet1_Navbar
      modelList={modelList}
      selectedModel={selectedModel}
      setSelectedModel={setSelectedModel}
      isRecevingMessage={isRecevingMessage}
      />
      <Component3_ChatView messages={messages} isRecevingMessage={isRecevingMessage}/>
      <Component2_ChatInput socket={socket} selectedModel={selectedModel} isReciving={isRecevingMessage} setIsRecivingMessage={setIsRecivingMessage} clientId={clientId} setImageBase64={setImageBase64}/>
    </div>
  );
}
