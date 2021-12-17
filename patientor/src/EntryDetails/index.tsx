import React from "react";
import { Segment, Header, Icon, Accordion, Divider } from "semantic-ui-react";

import { Entry, Diagnosis } from "../types";
import HealthRatingBar from "../components/HealthRatingBar";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled disciminated union member: ${JSON.stringify(value)}`
  );
};

const HospitalEntryDetails: React.FC<({ entry: Extract<Entry, {type: "Hospital"}>, diagnoses: {[code: string]: Diagnosis} })> = ({ entry, diagnoses }) => {
  const [activeIndex, setActiveIndex] = React.useState(-1);

  return (
    <Segment>
      <Header>
        {entry.date}
      </Header>

      <div style={{ backgroundColor: "white", position: "absolute", minWidth: "50px", top: "5px", right: "5px", textAlign: "center" }}>
        <Icon fitted color="teal" name="hospital" size="big"/><br/>
      </div>

      <Divider clearing />

      <p>
      {entry.description}<br/>
      <em>{entry.specialist}</em>
      </p>

      {entry.discharge &&
        <>
          <Divider />

          <p>
            <strong>Discharge </strong><br/>
            Criteria: {entry.discharge.criteria}<br/>
            Date: {entry.discharge.date}
          </p>
        </>
      }

      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 &&
        <>
          <Divider />

          <Accordion>
            {entry.diagnosisCodes && entry.diagnosisCodes.map((dc: string, i: number) => (
              <div key={dc}>
              <Accordion.Title
                active={activeIndex === i}
                index={i}
                onClick={() => setActiveIndex(index => index === i ? -1 : i)}
              >
                 <Icon name='dropdown' /> {dc}
              </Accordion.Title>
              <Accordion.Content
                active={activeIndex === i}
              >
                {diagnoses[dc].name}
              </Accordion.Content>
              </div>
            ))}
          </Accordion>
        </>
      }

    </Segment>
  );
};

const OccupationalHealthcareEntryDetails: React.FC<({ entry: Extract<Entry, {type: "OccupationalHealthcare"}>, diagnoses: {[code: string]: Diagnosis} })> = ({ entry, diagnoses }) => {
  const [activeIndex, setActiveIndex] = React.useState(-1);

  return (
    <Segment>
        <Header>
          {entry.date}
        </Header>

        <div style={{ backgroundColor: "white", position: "absolute", minWidth: "50px", top: "5px", right: "5px", textAlign: "center" }}>
          <Icon fitted color="grey" name="medkit" size="big"/><br/>
          <strong>{entry.employerName}</strong>
        </div>

      <Divider clearing />

      <p>
      {entry.description}<br/>
      <em>{entry.specialist}</em>
      </p>

      {entry.sickLeave &&
        <>
          <Divider />

          <p>
            <strong>Sickleave </strong><br/>
            Startdate: {entry.sickLeave.startDate}<br/>
            Enddate: {entry.sickLeave.endDate}
          </p>
        </>
      }

      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 &&
        <>
          <Divider />

          <Accordion>
            {entry.diagnosisCodes && entry.diagnosisCodes.map((dc: string, i: number) => (
              <div key={dc}>
              <Accordion.Title
                active={activeIndex === i}
                index={i}
                onClick={() => setActiveIndex(index => index === i ? -1 : i)}
              >
                 <Icon name='dropdown' /> {dc}
              </Accordion.Title>
              <Accordion.Content
                active={activeIndex === i}
              >
                {diagnoses[dc].name}
              </Accordion.Content>
              </div>
            ))}
          </Accordion>
        </>
      }

    </Segment>
  );
};


const HealthCheckEntryDetails: React.FC<({ entry: Extract<Entry, {type: "HealthCheck"}>, diagnoses: {[code: string]: Diagnosis} })> = ({ entry, diagnoses }) => {
  const [activeIndex, setActiveIndex] = React.useState(-1);

  return (
    <Segment>
        <Header>
          {entry.date}
        </Header>

        <div style={{ backgroundColor: "white", position: "absolute", minWidth: "50px", top: "5px", right: "5px", textAlign: "center" }}>
          <Icon fitted color="red" name="heartbeat" size="big"/><br/>
        </div>

      <Divider clearing />

      <p>
      {entry.description}<br/>
      <em>{entry.specialist}</em>
      </p>

      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 &&
        <>
          <Divider />

          <Accordion>
            {entry.diagnosisCodes && entry.diagnosisCodes.map((dc: string, i: number) => (
              <div key={dc}>
              <Accordion.Title
                active={activeIndex === i}
                index={i}
                onClick={() => setActiveIndex(index => index === i ? -1 : i)}
              >
                 <Icon name='dropdown' /> {dc}
              </Accordion.Title>
              <Accordion.Content
                active={activeIndex === i}
              >
                {diagnoses[dc].name}
              </Accordion.Content>
              </div>
            ))}
          </Accordion>
        </>
      }

      <Divider />

      <HealthRatingBar
        rating={entry.healthCheckRating}
        showText={true}
      />

    </Segment>
  );
};

const EntryDetails: React.FC<{ entry: Entry, diagnoses: {[code: string]: Diagnosis} }> = ({ entry, diagnoses }) => {
  switch (entry.type) {
  case "Hospital":
    return <HospitalEntryDetails entry={entry} diagnoses={diagnoses} />;
  case "OccupationalHealthcare":
    return <OccupationalHealthcareEntryDetails entry={entry} diagnoses={diagnoses} />;
  case "HealthCheck":
    return <HealthCheckEntryDetails entry={entry} diagnoses={diagnoses} />;
  default:
    return assertNever(entry);
  }
};

export default EntryDetails;
