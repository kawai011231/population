import styles from "./App.module.css";
import { useEffect, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

function App() {
  // 都道府県一覧
  const [prefectures, setPreFectures] = useState([]);
  // チェックされた都道府県一覧
  const [checkedPrefs, setCheckedPrefs] = useState([]);
  // 都道府県のデータ
  const [prefData, setPrefData] = useState({});
  // チェックされた都道府県一覧
  const [checkedDatas, setCheckedDatas] = useState([]);
  // カテゴリー
  const [category, setCategory] = useState([]);

  useEffect(() => {
    fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
      headers: { "X-API-KEY": process.env.REACT_APP_API_KEY },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPreFectures(data.result);
      });
    fetch(
      `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=0`,
      {
        headers: { "X-API-KEY": process.env.REACT_APP_API_KEY },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data.result.data[0].data;
      })
      .then((data) => {
        const categorieData = data.map((item) => {
          return item.year;
        });
        setCategory(categorieData);
        const arrayData = data.map((item) => {
          return item.value;
        });
        return arrayData;
      })
      .then((data) => {
        const japanData = [
          {
            index: 0,
            name: "日本",
            data: data,
          },
        ];
        return japanData;
      })
      .then((data) => {
        setCheckedDatas(data);
      });
  }, []);

  const handleClick = (e) => {
    const prefectureNumber = Number(e.target.value - 1);
    const prefectureName = prefectures[prefectureNumber].prefName;
    if (checkedPrefs.includes(prefectureNumber)) {
      setCheckedPrefs(checkedPrefs.filter((pref) => pref !== prefectureNumber));
      setCheckedDatas(
        checkedDatas.filter(
          (checkedData) => checkedData.index !== prefectureNumber + 1
        )
      );
    } else {
      setCheckedDatas(
        checkedDatas.filter((checkedData) => checkedData.index !== 0)
      );
      setCheckedPrefs([...checkedPrefs, prefectureNumber]);
      fetch(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${
          prefectureNumber + 1
        }`,
        {
          headers: { "X-API-KEY": process.env.REACT_APP_API_KEY },
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          return data.result.data[0].data;
        })
        .then((data) => {
          let arrayData = data.map((item) => {
            return item.value;
          });
          return arrayData;
        })
        .then((data) => {
          setPrefData({
            index: prefectureNumber + 1,
            name: prefectureName,
            data: data,
          });
        });
    }
  };

  useEffect(() => {
    setCheckedDatas([...checkedDatas, prefData]);
  }, [prefData]);

  const options = {
    title: {
      text: "総人口推移",
    },
    xAxis: {
      title: {
        text: "年度",
      },
      categories: category,
    },
    yAxis: {
      title: {
        text: "人口数",
      },
    },
    series: checkedDatas,
  };

  return (
    <div className="App">
      <header>
        <h1 className={styles.header}>都道府県人口推移グラフ</h1>
      </header>
      <main>
        <p className={styles.prefTitle}>都道府県</p>
        <ul className={styles.prefWrap}>
          {prefectures.map((prefecture) => (
            <li key={prefecture.prefCode} className={styles.prefElement}>
              <label>
                <input
                  type="checkbox"
                  onClick={handleClick}
                  value={prefecture.prefCode}
                />
                {prefecture.prefName}
              </label>
            </li>
          ))}
        </ul>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </main>
    </div>
  );
}

export default App;
