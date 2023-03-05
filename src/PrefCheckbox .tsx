import React from "react";

type Props = {
  prefCodeAndName: {
    prefCode: string;
    prefName: string;
  };
  checkboxes: {
    [key: string]: boolean;
  }[];
  setCheckboxes: React.Dispatch<
    React.SetStateAction<
      {
        [key: string]: boolean;
      }[]
    >
  >;
};

const PrefCheckbox = ({
  prefCodeAndName,
  checkboxes,
  setCheckboxes,
}: Props) => {

  return (
    <>
      <div key={prefCodeAndName.prefCode}>
        <input
          type="checkbox"
          id={`checkbox${prefCodeAndName.prefCode}`}
          name={prefCodeAndName.prefName}
          value={prefCodeAndName.prefName}
          onChange={(e) => {
            const newCheckboxes = checkboxes.map((checkbox) => {
              // Update the checkbox that was clicked
              if (e.target.name === Object.keys(checkbox)[0]) {
                return { [e.target.name]: e.target.checked };
              } else {
                return checkbox;
              }
            });
            setCheckboxes(newCheckboxes);
          }}
        />
        <label htmlFor={`checkbox${prefCodeAndName.prefCode}`}>
          {prefCodeAndName.prefName}
        </label>
      </div>
    </>
  );
};

export default PrefCheckbox;
