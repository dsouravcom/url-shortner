import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Home() {
  const [originUrl, setOriginUrl] = useState("");
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(import.meta.env.VITE_APP_SHORT_URL, {
        url: url,
      });

      if (response.status === 200) {
        setUrl("https://minilink.live/" + response.data.short_url);
        setOriginUrl(response.data.url);
        setResponse(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
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
          {isLoading ? (
            <button
              type="button"
              className="px-2 py-1 bg-blue-500 text-white border rounded-md mt-4 ms-2"
              disabled
            >
              <svg
                aria-hidden="true"
                className="inline w-6 h-8 mr-3 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              Shorting...
            </button>
          ) : (
            <button
              className="bg-blue-600 px-3 py-2 ms-2 w-fit rounded-lg mt-4"
              type="submit"
            >
              {response ? "Copy" : "Shorten"}
            </button>
          )}
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
