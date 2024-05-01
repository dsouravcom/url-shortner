import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Home() {
  const [originUrl, setOriginUrl] = useState("");
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(import.meta.env.VITE_APP_SHORT_URL, {
        url: url,
      });

      if (response.status === 200) {
        setUrl("http://localhost:8000/" + response.data.short_url);
        setOriginUrl(response.data.url);
        setResponse(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyUrl = (e) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(url)
      .then(() => {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Copied successfully",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClear = (e) => {
    e.preventDefault();
    setUrl("");
    setResponse(false);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-900 text-gray-200">
        <h1 className="px-4 text-center text-4xl font-serif mb-10">
          Wlcome to Mini Link a user friendly URL shortner tool
        </h1>

        <form
          className="flex flex-col items-center sm:flex-row sm:items-start"
          onSubmit={response ? handleCopyUrl : handleSubmit}
        >
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23"
            className="p-2 mt-4 rounded-lg bg-white text-black w-[300px] sm:w-[500px] border-2 border-gray-600 focus:outline-none focus:border-blue-500"
            disabled={response}
          />
          <button
            className="bg-blue-600 px-3 py-2 ms-2 w-fit rounded-lg mt-4"
            type="submit"
          >
            {response ? "Copy" : "Shorten"}
          </button>
        </form>
        <div>
          {response && (
            <p className="container mt-2 px-3 lg:px-14 overflow-y-scroll ">
              Long URL :
              <a
                target="_blank"
                rel="noopener"
                href={originUrl}
                className="text-blue-400 block break-all"
              >
                {originUrl}
              </a>
            </p>
          )}
          </div>
          <div>
          <Link to={"/analytics"}>
            <p className="text-gray-100 mt-8 rounded-lg px-3 py-2 bg-blue-600">
              Go to Analytics
            </p>
          </Link>
        </div>
        {response && (
          <button
            onClick={handleClear}
            className="text-gray-100 mt-2 rounded-lg px-3 py-2 bg-blue-600"
          >
            Short another URL
          </button>
        )}
      </div>
    </>
  );
}

export default Home;
