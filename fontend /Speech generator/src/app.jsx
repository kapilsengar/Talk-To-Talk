import React, { useState } from 'react';
import './App.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import html2canvas from 'html2canvas';
// Import a random image
import randomImage from './assets/randomImage.png';


function App() {
  const [text, setText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [recentSearch, setRecentSearch] = useState(""); // State for recent search
  const [showTemplate, setShowTemplate] = useState(false); // State to manage template visibility
  const [buttonClass, setButtonClass] = useState("px-2 py-1 h-10 border rounded-r-full text-white font-bold bg-blue-700");

  const api_key = "YOUR_API_KEY_HERE";

  const handleSubmit = async () => {
    setRecentSearch(text); // Save the prompt as recent search
    const genAI = new GoogleGenerativeAI(api_key); // Use REACT_APP_ prefix for environment variables
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([text]);
      let content = result.response.text();

      // Replace ** and # by blank spaces
      content = content.replace(/[*#]/g, ''); 
      
      setResponseText(content);
      setText(""); // Clear the input after generation
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Change button color to green for 2 seconds
      setButtonClass("px-2 py-1 h-10 border rounded-r-full text-white font-bold bg-green-500");

      setTimeout(() => {
        setButtonClass("px-2 py-1 h-10 border rounded-r-full text-white font-bold bg-blue-700");
      }, 2000); // Revert back to blue after 2 seconds

      handleSubmit(); // Call the generate function when Enter is pressed
    }
  };

  const handleShowTemplate = () => {
    setShowTemplate(!showTemplate);
    if (!showTemplate) {
      html2canvas(document.querySelector("#newsletter-template")).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'newsletter-template.png';
        link.click();
      });
    }
  };

  // Function to format the response text
  const formatResponseText = (text) => {
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      // Check if the line is a heading or a paragraph
      if (trimmedLine.length > 0) {
        // If the line starts with a bullet point (*), treat it as a paragraph
        return (
          <p key={index} className="flex items-start" style={{ marginBottom: "10px" }}>
            <span className="mr-2">&#8226;</span> {/* Bullet point */}
            {trimmedLine}
          </p>
        );
      } else {
        // If it's an empty line, don't display it
        return null;
      }
    });
  };

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center p-4 relative">
        
        {/* Add the random image at the top left corner */}
        <div className="fixed top-4 left-5">
          <img src={randomImage} alt="Random" className="h-20 w-20" /> {/* Adjust the size if needed */}
        </div>

        <div className="text-white mb-4 p-2 text-6xl font-semibold text-center">
          <span className="text-6xl font-bold text-blue-600">Talk-To-Talk</span>
        </div>

        {/* Display the recent search */}
        {recentSearch && (
          <div className="mb-4 text-white text-lg font-semibold">
            Recent Search: {recentSearch}
          </div>
        )}

        <div className="w-full flex justify-center mb-6">
          <div className="w-1/2 p-4 text-white text-justify max-h-96 h-96 overflow-auto -webkit-scrollbar:none">
            {responseText
              ? <ul>{formatResponseText(responseText)}</ul> // Display formatted text
              : "Hi How are you ? "}
          </div>
        </div>

        {/* Input Field */}
        <div className="w-1/2 flex mb-6">
          <input
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            value={text}
            className="text-2xl px-4 py-2 text-gray-500 w-full h-10 rounded-l-full -mx-1 outline-none focus:shadow-md focus:shadow-white"
            type="text"
            placeholder="Enter the prompt"
          />
          <button
            onClick={handleSubmit}
            className={buttonClass} // Dynamically apply the class
          >
            Generate
          </button>
        </div>

        {/* Button to Show/Hide the Template */}
        <button
          onClick={handleShowTemplate}
          className="px-4 py-2 bg-green-500 text-white font-bold rounded mt-4"
        >
          {showTemplate ? 'Hide Template' : 'Show Template'}
        </button>

        {/* Editable Template */}
        {showTemplate && (
          <div id="newsletter-template" className="newsletter-template mt-4 p-4 border border-gray-300 rounded flex flex-col">
            <h1 className='bg-blue-300 text-xl mb-2 rounded-full px-3 py-1'>Select Template</h1>

            <button className='bg-gray-300 rounded-full text-xl mb-2 px-3 py-1'>Template 1</button>
            <button className='bg-gray-300 rounded-full text-xl mb-2 px-3 py-1'>Template 2</button>
            <button className='bg-gray-300 rounded-full text-xl mb-2 px-3 py-1'>Template 3</button>
            <button className='bg-gray-300 rounded-full text-xl mb-2 px-3 py-1'>Template 4</button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
