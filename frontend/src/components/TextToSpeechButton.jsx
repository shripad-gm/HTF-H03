import React from "react";
import { Volume2 } from "lucide-react";

const TextToSpeechButton = () => {
  const handleSpeak = () => {
    const mainContent = document.querySelector(".content-area");
    if (!mainContent) return;

    const textToRead = mainContent.innerText;
    const chunks = splitTextIntoChunks(textToRead, 200);

    window.speechSynthesis.cancel();
    speakChunksSequentially(chunks);
  };

  const splitTextIntoChunks = (text, maxLength) => {
    const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
    const chunks = [];
    let currentChunk = "";

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxLength) {
        currentChunk += sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      }
    }

    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
  };

  const speakChunksSequentially = (chunks, index = 0) => {
    if (index >= chunks.length) return;

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      speakChunksSequentially(chunks, index + 1);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handleSpeak}
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        background: "#fab005",
        border: "none",
        padding: "12px",
        borderRadius: "12px",
        cursor: "pointer",
        boxShadow: "0 8px 24px rgba(250, 176, 5, 0.3)",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "50px",
        height: "50px",
        backdropFilter: "blur(5px)",
        borderTop: "2px solid #ffe066",
        borderLeft: "2px solid #ffe066",
        borderRight: "2px solid #f08c00",
        borderBottom: "2px solid #f08c00",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      aria-label="Speak all visible content"
    >
      <Volume2 size={24} color="white" />
    </button>
  );
};

export default TextToSpeechButton;
