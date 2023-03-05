import React from "react";
import PrefCheckbox from "./PrefCheckbox ";
// import styles from "./App.module.scss"
import { TARGET_PREFECTURES } from "./constants";

type PrefCodeAndName = {
  prefCode: string;
  prefName: string;
};

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [prefCodeAndNames, setPrefCodeAndNames] = React.useState<
    PrefCodeAndName[]
  >([]);
  const [checkboxes, setCheckboxes] = React.useState(
    TARGET_PREFECTURES.map((prefName: string) => ({ [prefName]: false }))
  );

  React.useEffect(() => {
    fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.REACT_APP_RESAS_API_KEY as string,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPrefCodeAndNames(data.result);
        setIsLoading(false);
      })
      .catch((error) => alert(error.message));

    // fetch(
    //   "https://opendata.resas-portal.go.jp/api/v1/population/sum/estimate?prefCode=26",
    //   {
    //     method: "GET",
    //     headers: {
    //       "X-API-KEY": process.env.REACT_APP_RESAS_API_KEY as string,
    //     },
    //   }
    // )
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((error) => alert(error.message));
  }, []);

  if (isLoading) {
    return <p>Now Loading...</p>;
  }

  return (
    <>
      {prefCodeAndNames
        .filter( // filter out the prefectures that are not in TARGET_PREFECTURES
          (prefCodeAndName) =>
            TARGET_PREFECTURES.indexOf(prefCodeAndName.prefName) !== -1
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
    </>
  );
}

export default App;
