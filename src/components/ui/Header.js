import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVideos } from "../util/YoutubeUtil";
import Loading from "./Loading";

const Header = ({ videos, setVideos }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [lastFetchDate, setLastFetchDate] = useState("N/A");

  const VIDEOS_LS = "videos";
  const LAST_FETCH_DATE_LS = "last_fetch";

  const loadAndSaveSheet = async () => {
    setIsImporting(true);
    let remoteVideos = await getVideos();
    localStorage.setItem(VIDEOS_LS, JSON.stringify(remoteVideos));
    const now = new Date();
    localStorage.setItem(LAST_FETCH_DATE_LS, now.getTime());
    setLastFetchDate(now);
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

    // Fetch google sheet automatically according to lastFetchDate
    const now = new Date();
    const FOUR_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 4;
    const diffInMs = now - lastFetchDateTemp;
    if (diffInMs > FOUR_DAYS_IN_MS) {
      console.log("trigger fetch");
      loadAndSaveSheet();
    }
  }, []);

  return (
    <>
      {isImporting ? <Loading /> : null}
      <header className="header">
        <div className="title">
          <h1 className="heading-1">할투 맵 0.1</h1>
          <h2 className="heading-2">애, 차, 개 out!!</h2>
        </div>
        <div className="header-nav">
          <Link className="btn-text btn-text--header" to="/">
            카테고리별
          </Link>
          <Link className="btn-text btn-text--header" to="/recommend">
            커스텀 추천
          </Link>
          <Link className="btn-text btn-text--header" to="/about">
            어바웃
          </Link>
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
    </>
  );
};

export default Header;
