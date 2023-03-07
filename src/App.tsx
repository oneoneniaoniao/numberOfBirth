import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import PrefCheckbox from "./PrefCheckbox ";
import { TARGET_PREFECTURES, CHART_TYPE } from "./constants";
import { DemographicsDataType, PrefectureType } from "./types";
import styles from "./App.module.scss";

type PrefCodeAndNameType = {
  message: null;
  result: PrefCodeAndName[];
};

type PrefCodeAndName = {
  prefCode: string;
  prefName: string;
};

type BirthDataObjType = {
  prefCode: string;
  prefName: string;
  birthData: {
    year: number;
    value: number | null;
  }[];
}[];

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [prefCodeAndNames, setPrefCodeAndNames] = React.useState<
    PrefCodeAndName[]
  >([]);
  const [checkboxes, setCheckboxes] = React.useState(
    TARGET_PREFECTURES.map((prefName: string) => ({ [prefName]: false }))
  );
  const [birthDataArray, setBirthDataArray] = React.useState<BirthDataObjType>(
    [] as BirthDataObjType
  );
  const [highchartsOptions, setHighchartsOptions] =
    React.useState<Highcharts.Options>({});
  const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null);

  React.useEffect(() => {
    const _birthDataArray = [] as BirthDataObjType;
    fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.REACT_APP_RESAS_API_KEY as string,
      },
    })
      .then((response) => response.json())
      .then((data: PrefCodeAndNameType) => {
        console.log(data);
        setPrefCodeAndNames(data.result);
        Promise.all(
          // Fetch demographics data for each prefecture
          data.result
            .filter(
              // Filter out the prefectures that are not in TARGET_PREFECTURES
              (data: any) => TARGET_PREFECTURES.indexOf(data.prefName) !== -1
            )
            .map((data: PrefCodeAndName) => {
              // Fetch the birth data for each prefecture
              _birthDataArray.push({
                // Store the prefCode in the _birthData array
                prefCode: data.prefCode,
                prefName: data.prefName,
                birthData: [],
              });
              return fetch(
                `https://opendata.resas-portal.go.jp/api/v1/population/sum/estimate?prefCode=${data.prefCode}`,
                {
                  method: "GET",
                  headers: {
                    "X-API-KEY": process.env.REACT_APP_RESAS_API_KEY as string,
                  },
                }
              );
            })
        ).then((dataArray) => {
          dataArray.forEach((data, index) => {
            data.json().then((data: DemographicsDataType) => {
              // Fill in the missing data with null for prefectures that is not start from 1960, in case of birth number, Okinawa.
              const tempData = data.result.data[3].data;
              let year = 1960;
              const NoDataLength =
                data.result.data[3].data.slice(-1)[0].year -
                1960 -
                data.result.data[3].data.length +
                1;
              for (let i = 0; i < NoDataLength; i++) {
                tempData.unshift({
                  year: year++,
                  value: null,
                });
              }
              // Store the formatted birth data in the _birthData array
              _birthDataArray[index].birthData.push(...tempData);
            });
          });
        });
      })
      .then(() => {
        console.log("_birthDataArray", _birthDataArray);
        setBirthDataArray(_birthDataArray);
        setIsLoading(false);
      })
      .catch((error) => alert(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    console.log(birthDataArray);
    setHighchartsOptions({
      chart: {
        type: CHART_TYPE,
      },
      title: {
        text: "出生数の推移",
        align: "center",
      },
      yAxis: {
        title: {
          text: "出生数",
        },
      },
      xAxis: {
        title: {
          text: "年",
        },
      },

      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false,
          },
          pointStart: 1960,
        },
      },
      tooltip: {
        shared: true,
      },

      series: birthDataArray
        // Filter out the prefectures that are not checked in the checkboxes.
        .filter((birthDataObj) =>
          checkboxes.find((checkbox) => checkbox[birthDataObj.prefName])
        )
        .map((birthDataObj) => {
          return {
            name: birthDataObj.prefName,
            data: birthDataObj.birthData.map((birthData) => birthData.value),
            type: CHART_TYPE,
          };
        }),
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
              },
            },
          },
        ],
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkboxes]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <span className={styles.loader}></span>
        <div>Now Loading...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          alignItems: "space-between",
          justifyContent: "flex-start",
          maxWidth: "90vw",
          width: "800px",
          height: `${TARGET_PREFECTURES.length * 5}px`,
          minHeight: "4rem",
        }}
      >
        {prefCodeAndNames
          .filter(
            // filter out the prefectures that are not in TARGET_PREFECTURES
            (prefCodeAndName) =>
              TARGET_PREFECTURES.indexOf(
                prefCodeAndName.prefName as PrefectureType
              ) !== -1
          )
          .map((prefCodeAndName) => {
            return (
              <div key={prefCodeAndName.prefCode}>
                <PrefCheckbox
                  prefCodeAndName={prefCodeAndName}
                  checkboxes={checkboxes}
                  setCheckboxes={setCheckboxes}
                />
              </div>
            );
          })}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "1fr",
          gridTemplateColumns: "1fr",
        }}
      >

        <div style={{ gridRow: "1/2", gridColumn: "1/2" }}>
          <div style={{ maxWidth: "90vw", width: "800px" }}>
            <HighchartsReact
              highcharts={Highcharts}
              options={highchartsOptions}
              ref={chartComponentRef}
            />
          </div>
        </div>
                {checkboxes.filter((checkbox) => Object.values(checkbox)[0] === true)
          .length === 0 && (
          <div style={{ gridRow: "1/2", gridColumn: "1/2" ,zIndex:100}}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "90vw",
                width: "800px",
                height:"90%",
              }}
            >
              <div
                style={{
                  color:"#777",
                  border: "solid 1px #999",
                  padding: "20px",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                チェックボックスを選択すると
                <br />
                グラフが描画されます
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
