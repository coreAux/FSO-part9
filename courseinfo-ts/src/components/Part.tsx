import React from "react";

import { CoursePart } from "../types"

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled disciminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ coursePart }: { coursePart: CoursePart }) => {

  const base = <><strong>{coursePart.name} {coursePart.exerciseCount}</strong></>


  switch (coursePart.type) {
    case "normal":
      return (
        <>
          <p>
            {base}<br />
            <em>{coursePart.description}</em>
          </p>
        </>
      );
    case "groupProject":
      return (
        <>
          <p>
            {base}<br />
            project exercises {coursePart.groupProjectCount}
          </p>
        </>
      );
    case "submission":
      return (
        <>
          <p>
            {base}<br />
            <em>{coursePart.description}</em><br />
            submit to {coursePart.exerciseSubmissionLink}
          </p>
        </>
      );
    case "special":
      return (
        <>
          <p>
            {base}<br />
            <em>{coursePart.description}</em><br />
            required skills: {coursePart.requirements.map((r, i) => (
              <span key={r}>
                {r}{(i + 1) !== coursePart.requirements.length ? ", " : ""}
              </span>
            ))}
          </p>
        </>
      );
    default:
      return assertNever(coursePart)
  }
}

export default Part;
