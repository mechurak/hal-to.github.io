import React, { useEffect, useState } from "react";
import { getVideos } from "../util/YoutubeUtil";

const Header = ({ videos, setVideos }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [lastFetchDate, setLastFetchDate] = useState("N/A");

  const VIDEOS_LS = "videos";
  const LAST_FETCH_DATE_LS = "last_fetch";

  const loadAndSaveSheet = async () => {
    setIsImporting(true);
    let remoteVideos = await getVideos();
    localStorage.setItem(VIDEOS_LS, JSON.stringify(remoteVideos));
    localStorage.setItem(LAST_FETCH_DATE_LS, Date.now());
    setVideos(remoteVideos);
    setIsImporting(false);
  };

  useEffect(() => {
    console.log("Header mounted");
    const localVideos = JSON.parse(localStorage.getItem(VIDEOS_LS)) || [];
    const lastFetchDateStr = localStorage.getItem(LAST_FETCH_DATE_LS) || "0";
    const lastFetchDateTemp = new Date(parseInt(lastFetchDateStr));
    setLastFetchDate(lastFetchDateTemp);
    setVideos(localVideos);
  }, []);

  return (
    <header className="header">
      <div className="title">
        <h1 className="heading-1">할투 맵 0.1</h1>
        <h2 className="heading-2">애, 차, 개 out!!</h2>
      </div>
      <div className="header-nav">
        <button className="btn-text btn-text--header">할투 영상</button>
        <button className="btn-text btn-text--header">추천 사이트</button>
        <button className="btn-text btn-text--header">어바웃</button>
        <button
          className="btn-text btn-text--header"
          onClick={loadAndSaveSheet}
        >
          갱신
        </button>
        {isImporting ? (
          <div className="header-nav--info">fetching...</div>
        ) : (
          <div className="header-nav--info">
            <p>{videos.length} videos are fetched</p>
            <p>last fetch: {lastFetchDate.toLocaleString()}</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
