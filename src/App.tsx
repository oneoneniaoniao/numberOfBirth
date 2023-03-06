import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import PrefCheckbox from "./PrefCheckbox ";
import { TARGET_PREFECTURES, CHART_TYPE } from "./constants";
import { DemographicsDataType, PrefectureType } from "./types";

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
              // Fill in the missing data with null; for data which is not start from 1960.
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
        text: "出生数",
        align: "center",
      },
      yAxis: {
        title: {
          text: "人数",
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
          // label: {
          // connectorAllowed: false,
          // },
          pointStart: 1960,
        },
      },
      
      series: birthDataArray
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkboxes]);

  const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null);

  if (isLoading) {
    return <p>Now Loading...</p>;
  }

  return (
    <>
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
      <HighchartsReact
        highcharts={Highcharts}
        options={highchartsOptions}
        ref={chartComponentRef}
      />
    </>
  );
}

export default App;
