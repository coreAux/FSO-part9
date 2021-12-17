import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Icon, Container, Button } from "semantic-ui-react";

import { Patient, Entry } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, updatePatient } from "../state";

import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import AddEntryModal from "../AddEntryModal";
import EntryDetails from "../EntryDetails";

const PatientPage = () => {
  const [p, setPatient] = React.useState<Patient>();
  const { id } = useParams<{ id: string }>();
  const [{ patients, diagnoses }, dispatch] = useStateValue();

  // Adding new entry modal states...
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);
  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: currentPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      setPatient(currentPatient);
      dispatch(updatePatient(currentPatient));
      closeModal();
    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unkown error');
    }

  };

  React.useEffect(() => {
    if (Object.keys(patients).includes(id) && !patients[id].ssn) {
      const fetchPatientList = async () => {
        try {
          const { data: currentPatient } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );

          setPatient(currentPatient);
          dispatch(updatePatient(currentPatient));
        } catch (e) {
          console.error(e);
        }
      };
      void fetchPatientList();
    } else {
      setPatient(patients[id]);
    }
  }, [dispatch, patients]);

  if (!p || !patients[id].ssn ||Object.keys(diagnoses).length === 0) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div className="App">
      <Container textAlign="left">
        <h2>
          {p.name}{" "}

          {p.gender === "male" &&
            <Icon circular inverted size="small" name="mars" />}
          {p.gender === "female" &&
            <Icon circular inverted size="small" name="venus" />}
          {p.gender === "other" &&
            <Icon circular inverted size="small" name="other gender vertical"/>}
        </h2>
      </Container>

      <Container>
        <p>
          <strong>SSN</strong>: {p.ssn}<br />
          <strong>Occupation</strong>: {p.occupation}
        </p>
      </Container>


        <AddEntryModal
          modalOpen={modalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
        />




        <Container textAlign="center" style={{position: "relative"}}>
          <h3>Entries</h3>
          <Button
            style={{position: "absolute", top: "-5px", right: "0px"}}
            onClick={() => openModal()}
          >
            Add New Entry
          </Button>
        </Container>

        {p.entries.length === 0 && <p>No entries...</p>}

        {p.entries.map((e: Entry) => (
          <EntryDetails key={e.id} entry={e} diagnoses={diagnoses}/>
        ))}

    </div>
  );
};

export default PatientPage;
