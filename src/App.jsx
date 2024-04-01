/* eslint-disable no-useless-escape */
import { VscOpenPreview, VscCopy } from "react-icons/vsc";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Drawer from "react-bottom-drawer";

function App() {
  const [code, setCode] = useState("");
  const [snippet, setSnippet] = useState("");
  const [prefix, setPrefix] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    // Load all items from local storage
    const prefix = JSON.parse(localStorage.getItem("prefix"));
    const description = JSON.parse(localStorage.getItem("description"));
    const code = JSON.parse(localStorage.getItem("code"));
    const snippet = JSON.parse(localStorage.getItem("snippet"));

    // Set all items to the state
    if (prefix) setPrefix(prefix);
    if (description) setDescription(description);
    if (code) setCode(code);
    if (snippet) setSnippet(snippet);
  }, []);

  const generateSnippet = () => {
    // split the snippet by new line
    const lines = code.split("\n");

    // Generate the snippet
    const snippetCode = {
      prefix,
      body: lines,
      description,
    };

    // Convert the snippet to JSON
    const snippetJSON = JSON.stringify(snippetCode, null, 2);
    const descriptionJSON = JSON.stringify(description, null, 2);

    // Set the snippet to the state
    setSnippet(`${descriptionJSON}: ${snippetJSON}`);

    // Save all items to local storage
    localStorage.setItem("prefix", JSON.stringify(prefix));
    localStorage.setItem("description", descriptionJSON);
    localStorage.setItem("code", JSON.stringify(code));
    localStorage.setItem("snippet", snippetJSON);
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-tr from-blue-100 to-zinc-100 p-5 flex flex-col items-center">
      <Toaster />
      <header className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-thin text-zinc-900">
          VSCode Snippet Generator
        </h1>
        <div className="flex-col md:flex-row flex items-center gap-2">
          <button
            onClick={() => {
              if (!code) return toast.error("Please enter a snippet!");
              if (!prefix) return toast.error("Please enter a prefix!");
              if (!description)
                return toast.error("Please enter a description!");
              generateSnippet();
              setPreview(true);
            }}
            className="flex flex-1 items-center gap-2 bg-zinc-800 text-white rounded-md py-2 px-4 shadow-md active:scale-90 ease-linear duration-75 transition-all"
          >
            <VscOpenPreview size={20} /> Preview
          </button>
          <button
            className="flex items-center gap-2 bg-zinc-800 text-white rounded-md py-2 px-4 shadow-md active:scale-90 ease-linear duration-75 transition-all"
            onClick={() => {
              if (!code) return toast.error("Please enter a snippet!");
              if (!prefix) return toast.error("Please enter a prefix!");
              if (!description)
                return toast.error("Please enter a description!");
              generateSnippet();
              navigator.clipboard.writeText(snippet);
              toast.success("Copied to clipboard!");
            }}
          >
            <VscCopy size={20} /> Copy
          </button>
        </div>
      </header>
      <main className="w-full lg:w-2/3 mt-5 flex-1 flex gap-4 flex-col justify-center items-center">
        <div className="flex w-full justify-between gap-4">
          <div className="flex-1">
            <label htmlFor="prefix">Prefix for triggering</label>
            <input
              type="text"
              id="prefix"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full mt-1 p-4 border-none rounded-md shadow-md outline-none"
              placeholder="Enter your prefix here..."
            />
          </div>
          <div className="flex-1">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-4 border-none rounded-md shadow-md outline-none"
              placeholder="Enter your description here..."
            />
          </div>
        </div>
        <textarea
          className="w-full flex-1 p-8 rounded-md border-none outline-none shadow-md resize-none"
          placeholder="Enter your snippet here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        ></textarea>
      </main>
      <Drawer
        duration={250}
        hideScrollbars={true}
        onClose={() => setPreview(false)}
        isVisible={preview}
      >
        <div className="w-full h-full bg-white p-5 rounded-t-lg">
          <h1 className="text-2xl font-thin text-zinc-900">Preview</h1>
          <pre className="w-full mt-5 rounded-md overflow-auto border border-gray-200 p-5 bg-zinc-50">
            {snippet}
          </pre>
        </div>
      </Drawer>
    </section>
  );
}

export default App;
