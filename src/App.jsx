import styles from "./App.module.css";
import { useEffect, useState } from "react";

function App() {
  // 都道府県一覧
  const [prefectures, setPreFectures] = useState([]);

  useEffect(() => {
    fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
      headers: { "X-API-KEY": process.env.REACT_APP_API_KEY },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        setPreFectures(data.result);
      });
  }, []);

  return (
    <div className="App">
      <header>
        <h1 className={styles.header}>都道府県人口推移グラフ</h1>
      </header>
      <main>
        <ul className={styles.prefWrap}>
          {prefectures.map((prefecture) => (
            <li key={prefecture.prefCode} className={styles.prefElement}>
              <label>
                <input type="checkbox" value={prefecture.prefCode} />
                {prefecture.prefName}
              </label>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
