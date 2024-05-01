import React, { useState, useEffect } from "react";
import axios from "axios";

function Analytics() {
  const [data, setData] = useState([]);
  var [url, setUrl] = useState("");
  const [totalView, setTotalView] = useState(0);
  const [isVallid, setIsVallid] = useState(false);

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
    
        setData(chartData);
      }
    } catch (error) {
      console.error(error);
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
          <button
            className="bg-blue-600 px-3 py-3 ms-2 w-fit rounded-lg"
            type="submit"
          >
            Search
          </button>
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
