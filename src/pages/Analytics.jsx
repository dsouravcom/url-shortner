import React, { useState, useEffect } from "react";
import axios from "axios";

function Analytics() {
  const [data, setData] = useState([]);
  var [url, setUrl] = useState("");
  const [totalView, setTotalView] = useState(0);
  const [isVallid, setIsVallid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.startsWith("https://")) {
      // If not, prepend "https://"
      url = "https://" + url;
    }
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    if (hostname !== "minilink.live") {
      console.log("Invalid domain"); // or handle it as needed
      setIsVallid(true);
      return;
    }
    setIsVallid(false);
    const pathname = parsedUrl.pathname;
    const lettersAfterDomain = pathname.slice(1);

    try {
      setIsLoading(true);
      const response = await axios.get( import.meta.env.VITE_APP_ANALYTICS_URL + lettersAfterDomain);
      if (response.status === 200) {
        setTotalView(response.data.totalView);
        const rawData = (response.data.analytics);
        const processedData = rawData.reduce((acc, item) => {
          const date = new Date(item.timeStamp).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1; // Count clicks for each date
          return acc;
        }, {});
    
        const chartData = Object.entries(processedData).map(([date, clicks]) => ({
          date,
          clicks,
        }));
    
        setIsLoading(false);
        setData(chartData);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-900 text-gray-200">
        <div>
          <h1 className="text-4xl border-b-2 py-8 w-screen text-center">
            Mini Link Analytics
          </h1>
        </div>
        <form
          className="flex flex-col sm:flex-row justify-center items-center mt-10"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://google.com/"
            className="p-3 w-4/5 sm:w-1/2 md:w-1/3 rounded-lg text-black mb-3 sm:mb-0  border-2 border-gray-600 focus:outline-none focus:border-blue-500"
          />
          {isLoading ? (
            <button
              type="button"
              className="px-2 py-2 bg-blue-500 text-white border rounded-md ms-2"
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
              Searching...
            </button>
          ) : (
          <button
            className="bg-blue-600 px-3 py-3 ms-2 w-fit rounded-lg"
            type="submit"
          >
            Search
          </button>
          )}
        </form>
        {isVallid && (
          <p className="text-center mt-2 text-red-500">! Please enter a minilink short url</p>)}
        <div className="flex justify-center items-center px-3 mb-8 sm:mb-0 text-lg mt-4">
          <h1>
            Result of this URL : -{" "}
            <span className="text-blue-300">{url}</span>
          </h1>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center md:px-40 mt-4 md:mt-10">
          <div className="container w-fit rounded-lg shadow-md shadow-slate-500 bg-slate-700 border-2 px-4 mb-4 md:mr-40 md:mb-0">
            <h1 className="text-2xl text-center font-extrabold mt-4">
              Total view
            </h1>
            <p className="text-center text-lg font-bold my-2">{totalView}</p>
          </div>
          <div className="container w-fit h-80 overflow-y-scroll border-2 px-8 rounded-lg">
            <h1 className="text-2xl text-center font-extrabold">chart</h1>
            <table>
              <thead>
                <tr>
                  <th className="pr-6">Date</th>
                  <th className="ps-6">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.date}>
                    <td className="pr-4">{item.date}</td>
                    <td className="ps-10">{item.clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Analytics;
