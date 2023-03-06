import React from "react";
import PrefCheckbox from "./PrefCheckbox ";
// import styles from "./App.module.scss"
import { TARGET_PREFECTURES } from "./constants";
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
  boundaryYear: number;
  birthData: {
    year: number;
    value: number;
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
                boundaryYear: 0,
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
          dataArray.map((data, index) => {
            data.json().then((data: DemographicsDataType) => {
              console.log("demographics data", data);
              _birthDataArray[index].birthData.push(
                ...data.result.data[3].data
              );
              _birthDataArray[index].boundaryYear = data.result.boundaryYear;
            });
          });
        });
      })
      .then(() => {
        setIsLoading(false);
        console.log("_birthDataArray", _birthDataArray);
        setBirthDataArray(_birthDataArray);
      })
      .catch((error) => alert(error.message));
  }, []);

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
            <>
              <div key={prefCodeAndName.prefCode}>
                <PrefCheckbox
                  prefCodeAndName={prefCodeAndName}
                  checkboxes={checkboxes}
                  setCheckboxes={setCheckboxes}
                />
              </div>
            </>
          );
        })}
    </>
  );
}

export default App;
