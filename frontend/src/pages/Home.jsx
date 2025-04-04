import React, { useContext, useEffect, useState } from 'react'
import Footer from '../Components/Footer'
import { NavContext } from '../contexts/NavContext'
import { AuthContext } from '../contexts/AuthContext.jsx'

const Home = () => {
  const { isActive } = useContext(NavContext);
  const [prompt, setPrompt] = useState('');

  const{chat, setChat} = useContext(AuthContext);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);  // New state for loading
  const apiKey = 'AIzaSyAMcnLuNirsAwQHjr6WOWHeUu2l0DaY9Q0';
  const { setUser, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    // setting loggedin user from the localstorage
    setUser(localStorage.getItem("user"));

  })

  async function generateContentWithGemini(apiKey, prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      setLoading(true); // Start loading before fetch
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      return generatedText;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    } finally {
      setLoading(false); // Stop loading after fetch
    }
  }

  function formatResponse(text) {
    let lines = text.split('\n');
    let output = [];
    let inList = false;
    let currentList = [];
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLanguage = '';

    for (let line of lines) {
      if (line.trim().startsWith('```')) {
        line = line.trim();
        if (inCodeBlock) {
          output.push(`<div className="text-gray-900" style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; white-space: pre-wrap; margin: 10px 0; font-family: monospace; color: #333; overflow-x: auto;">${highlightCode(codeBlockContent.trim())}</div>`);
          codeBlockContent = '';
          inCodeBlock = false;
          codeBlockLanguage = '';
        } else {
          inCodeBlock = true;
          codeBlockLanguage = line.trim().substring(3).trim();
        }
      } else if (inCodeBlock) {
        codeBlockContent += line + '\n';
      } else if (line.trim().startsWith('* ')) {
        let listItem = line.substring(2).trim();
        // let listItem = line.trim().substring(2);
        if (listItem.includes('**')) {
          let parts = listItem.split('**');
          let h2Content = parts[1] || '';
          let paragraphContent = parts.slice(2).join('**') || ''; // Handle nested **
          if (inList) {
            output.push(`<ul className="text-gray-900">${currentList.join('')}</ul>`);
            currentList = [];
            inList = false;
          }
          output.push(`<h2 className="text-gray-900">${h2Content}</h2>`);
          if (paragraphContent.trim() !== '') {
            output.push(`<p className="text-gray-900">${paragraphContent.trim()}</p>`);
            output.push('<br>');
          }
        } else {
          currentList.push(`<li className="text-gray-900">${listItem}</li>`);
          inList = true;
        }
      } else {
        if (inList) {
          output.push(`<ul className="text-gray-900">${currentList.join('')}</ul>`);
          currentList = [];
          inList = false;
        }
        if (line.trim() !== '') {
          if (line.startsWith('**') && line.endsWith('**')) {
            let h1Content = line.substring(2, line.length - 2);
            output.push(`<br/><h2 className="text-gray-900">${h1Content}</h2>`);
          } else if (line.includes('**')) {
            let parts = line.split('**');
            let headingContent = parts[1] || '';
            let paragraphContent = parts.slice(2).join('**') || ''; // Handle nested **
            output.push(`<h2 className="text-gray-900">${headingContent}</h2>`);
            if (paragraphContent.trim() !== '') {
              output.push(`<p className="text-gray-900">${paragraphContent.trim()}</p>`);
              output.push('<br>');
            }
          } else {
            let parts = line.split('\n');
            for (let i = 0; i < parts.length; i++) {
              output.push(`<p className="text-gray-900">${parts[i]}</p>`);
              if (i < parts.length - 1) {
                output.push('<br>');
              }
            }
          }
        }
      }
    }

    if (inList) {
      output.push(`<ul className="text-gray-900">${currentList.join('')}</ul>`);
    }

    return output.join('');
  }

  function highlightCode(code) {
    let result = '';
    let inSpan = false;
    let currentSpan = '';

    for (let i = 0; i < code.length; i++) {
      const char = code[i];

      if (char === '<' && code.substring(i, i + 6) === '<span ') {
        inSpan = true;
        currentSpan += char;
      } else if (inSpan && char === '>') {
        inSpan = false;
        currentSpan += char;
        result += currentSpan;
        currentSpan = '';
      } else if (inSpan) {
        currentSpan += char;
      } else {
        let highlightedChar = char;
        if (!inSpan) {
          if (/\b(function|const|let|var|if|else|return|for|while)\b/.test(code.substring(i, i + 20))) {
            let match = code.substring(i).match(/\b(function|const|let|var|if|else|return|for|while)\b/);
            if (match && match.index === 0) {
              highlightedChar = `<span style="color: #0070c1;">${match[0]}</span>`;
              i += match[0].length - 1;
            }
          } else if (code.substring(i, i + 2) === '//') {
            let match = code.substring(i).match(/\/\/.+/);
            if (match && match.index === 0) {
              highlightedChar = `<span style="color: #6a9955;">${match[0]}</span>`;
              i += match[0].length - 1;
            }
          } else if (char === "'" || char === '"') {
            let match = code.substring(i).match(/('.*?'|".*?")/);
            if (match && match.index === 0) {
              highlightedChar = `<span style="color: #d16969;">${match[0]}</span>`;
              i += match[0].length - 1;
            }
          } else if (/\b\d+\b/.test(code.substring(i, i + 20))) {
            let match = code.substring(i).match(/\b\d+\b/);
            if (match && match.index === 0) {
              highlightedChar = `<span style="color: #b5cea8;">${match[0]}</span>`;
              i += match[0].length - 1;
            }
          } else if (char === '<') {
            highlightedChar = '&lt;';
          } else if (char === '>') {
            highlightedChar = '&gt;';
          }
        }
        result += highlightedChar;
      }
    }
    return result;
  }

  const handlePrompt = async () => {
    if (prompt.trim() === '') return;
    const userMessage = { role: "user", text: prompt };
    setChat(prevChat => [...prevChat, userMessage]);
    setPrompt('');

    try {
      const response = await generateContentWithGemini(apiKey, prompt);
      setResponseText(response);
      const finalResponse = await formatResponse(response);
      const aiMessage = { role: "ai", text: finalResponse };
      setChat(prevChat => [...prevChat, aiMessage]);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={`w-full h-[calc(100vh-80px)] md:h-[calc(100vh-60px)] absolute top-[80px] md:top-[60px] flex justify-center ${isActive && `md:pl-[20%] md:justify-center`}`}>
      <div className={`relative w-full h-full bg-white px-6 pb-[13vh] pt-4 md:w-3/5 ${isActive && `md:w-4/5`} overflow-auto`}>

        {/* Chat Messages */}
        <div className='h-full z-51 w-full overflow-auto scrollbar-none md:h-[75vh] flex flex-col pt-6'>
          {chat.map((message, index) => (
            <div key={index} className={`p-2 my-1 rounded-lg max-w-[85%] 
              ${message.role === "user" ? "bg-gray-200 self-end" : "bg-white self-start"}`}>
              {message.role === "ai" ? (
                <p className="text-gray-800 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: message.text }} />
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap">{message.text}</p>
              )}
            </div>
          ))}

          {/* Loader */}
          {loading && (
            <div className="flex justify-start items-center py-4">
              <div className="w-6 h-6 border-4 border-grey-500 border-dashed rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <Footer prompt={prompt} setPrompt={setPrompt} apiKey={apiKey} handlePrompt={handlePrompt} />
      </div>
    </div>
  )
}

export default Home
