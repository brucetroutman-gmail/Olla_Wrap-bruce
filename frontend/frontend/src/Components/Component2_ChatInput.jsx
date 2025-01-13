
import React, { useState } from "react";

export default function Component2_ChatInput({ socket, selectedModel, isReciving, setIsRecivingMessage, clientId ,setImageBase64}) {
  const [input, setInput] = useState("");
  const [fileContent, setFileContent] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64Content = reader.result.split(",")[1];
        setFileContent(base64Content);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (isReciving) {
      const response = await fetch(`http://127.0.0.1:8000/halt_generation/${clientId}`);
      const data = await response.json();
      if (data) {
        setIsRecivingMessage(false);
      }
    } else {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const message = {
          model: selectedModel,
          content: input.trim(),
          file: fileContent,
        };
        setFileContent(null)
        socket.send(JSON.stringify(message));
        setInput("");
      } else {
        console.error("WebSocket is not connected.");
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        return;
      }
      event.preventDefault(); 
      handleSendMessage(); 
    }
  };

  return (
    <div className="container">
      <div className="input-group input-group-lg mb-3 ">
        <input
          type="file"
          id="formFile"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: "none" }} 
        />
        <label htmlFor="formFile" className="btn btn-dark rounded">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
  <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z"/>
</svg>
        </label>
        <textarea
          className="form-control text-dark rounded bg-light border border-light lead fw-normal "
          rows="1"
          aria-label="With textarea"
          placeholder="Type your message here..."
          style={{ resize: "none" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} 
          disabled={isReciving}
        ></textarea>
        <button className="btn btn-dark rounded" type="button" onClick={handleSendMessage}>
          {isReciving ? "stop" : "chat"}
        </button>
      </div>
    </div>
  );
}
