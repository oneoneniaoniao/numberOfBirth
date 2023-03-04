import React from "react";
// import styles from "./App.module.scss"

type PrefCode = {
  prefCode: string;
  prefName: string;
};

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [prefCodes, setPrefCodes] = React.useState<PrefCode[]>([]);


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
        setPrefCodes(data.result);
        // setIsLoading(false);
      })
      .catch((error) => alert(error.message));

      fetch("https://opendata.resas-portal.go.jp/api/v1/population/sum/estimate?prefCode=26", {
        method: "GET",
        headers: {
          "X-API-KEY": process.env.REACT_APP_RESAS_API_KEY as string,
          },
          })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setIsLoading(false);
          })
          .catch((error) => alert(error.message));

  }, []);

  if (isLoading) {
    return <p>Now Loading...</p>;
  }

  return (
    <>
      <p>Hello RESAS</p>
  
    </>
  );
}

export default App;
