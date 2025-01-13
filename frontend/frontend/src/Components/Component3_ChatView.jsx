import React from "react";
import { marked } from "marked";

export default function Component3_ChatView({ messages , isRecevingMessage}) {
  const allMessages = messages.map(message => message.content).join('');

  const htmlContent = marked(allMessages);

  return (
    <div className="container">
      <div
        className="container custom-scroll-container"
        style={{
          maxWidth: "80%",
        }}
      >
        <div
          className="custom-scrollbar-css p-2"
          dangerouslySetInnerHTML={{
            __html: htmlContent,
          }}
        />
      </div>
    </div>
  );
  
}



