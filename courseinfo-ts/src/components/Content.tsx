import React from "react";
import Part from "./Part";

import { CoursePart } from "../types";

const Content = ({ courseParts }: { courseParts: Array<CoursePart>}) => {

  return (
    <>
      {courseParts.map((p) => (
        <Part
          key={p.name}
          coursePart={p}
        />
      ))}
    </>
  )
};

export default Content;
