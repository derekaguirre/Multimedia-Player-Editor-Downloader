import React from "react";
import "./styles.scss";

interface Props{
    searchIn: string | number;
    setSearchIn: React.Dispatch<React.SetStateAction<string | number>>;
}

const InputField: React.FC<Props> = ({searchIn, setSearchIn}: Props) => {
  return (
    <form className="input" >
      <input className="input__box" type="input"
       value = {searchIn}
       onChange={(e)=>setSearchIn(e.target.value)}
       placeholder="Search" />
      <button className="input_submit" type="submit">Go</button>
    </form>
  );
};

export default InputField;
