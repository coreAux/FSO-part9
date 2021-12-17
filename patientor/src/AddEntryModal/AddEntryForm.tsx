import React from "react";
import { useStateValue } from "../state";

import { Grid, Button, Menu, Segment } from "semantic-ui-react";
import { Field, Form, withFormik, FormikProps, /*FormikErrors*/ } from "formik";

import { TextField, DiagnosisSelection, HeartRatingField } from "../AddPatientModal/FormField";
import { Entry } from "../types";

/*
 * use type Entry, but omit id,
 * because those are irrelevant for new entry object.
 */
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
export type EntryFormValues = UnionOmit<Entry, 'id'>;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const EnhancedAddEntryForm = (props: Props & FormikProps<EntryFormValues>) => {
  const [{ diagnoses }] = useStateValue();
  const [type, setType] = React.useState("HealthCheck");
  const { validateForm, values, isSubmitting, setFieldValue, setFieldTouched, dirty, isValid, onCancel, resetForm } = props;

  React.useEffect(() => {
    switch(type) {
    case "HealthCheck":
      values.type = "HealthCheck";
      void validateForm();
      break;
    case "Hospital":
      values.type = "Hospital";
      void validateForm();
      break;
    case "OccupationalHealthcare":
      values.type = "OccupationalHealthcare";
      void validateForm();
      break;
    default:
      values.type = "HealthCheck";
      void validateForm();
      break;
    }
  }, [type]);

  return (
    <>
      <Menu attached='top' tabular>
        <Menu.Item
          name='Health Check'
          active={type === 'HealthCheck'}
          onClick={() => setType("HealthCheck")}
        />
        <Menu.Item
          name='Occupational HealthCare'
          active={type === 'OccupationalHealthcare'}
          onClick={() => setType("OccupationalHealthcare")}
        />
        <Menu.Item
          name='Hospital'
          active={type === 'Hospital'}
          onClick={() => setType("Hospital")}
        />
      </Menu>

      <Segment attached='bottom'>
        <Form className="form ui">
          <DiagnosisSelection
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            diagnoses={Object.values(diagnoses)}
          />
          <Field
            label="Date"
            placeholder="YYYY-MM-DD"
            name="date"
            component={TextField}
          />
          <Field
            label="Description"
            placeholder="Description"
            name="description"
            component={TextField}
          />
          <Field
            label="Specialist"
            placeholder="Specialist"
            name="specialist"
            component={TextField}
          />

          {type === "HealthCheck" &&
            <HeartRatingField
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            />
          }

          {type === "OccupationalHealthcare" &&
            <>
              <Field
                label="Employer Name"
                placeholder="Employer Name"
                name="employerName"
                component={TextField}
              />
              <h3>Sick Leave</h3>
              <Field
                label="Start date"
                placeholder="YYYY-MM-DD"
                name="sickLeave.startDate"
                component={TextField}
              />
              <Field
                label="End date"
                placeholder="YYYY-MM-DD"
                name="sickLeave.endDate"
                component={TextField}
              />
            </>
          }

          {type === "Hospital" &&
            <>
              <h3>Discharge</h3>
              <Field
                label="Criteria"
                placeholder="Criteria"
                name="discharge.criteria"
                component={TextField}
              />
              <Field
                label="Date"
                placeholder="YYYY-MM-DD"
                name="discharge.date"
                component={TextField}
              />
            </>
          }

          <Grid>
            <Grid.Column floated="left" width={5}>
              <Button type="button" onClick={onCancel} color="red">
                Cancel
              </Button>
            </Grid.Column>
            <Grid.Column textAlign="center" width={5}>
              <Button
                type="button"
                onClick={() => {
                  if (window.confirm("Reset form?")) {
                    resetForm();
                  }
                }}
                disabled={!dirty}
              >
                Reset
              </Button>
            </Grid.Column>
            <Grid.Column floated="right" width={5}>
              <Button
                type="submit"
                floated="right"
                color="green"
                disabled={!dirty || !isValid || isSubmitting}
              >
                Add Entry
              </Button>
            </Grid.Column>
          </Grid>
        </Form>
      </Segment>
    </>
  );
};

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const AddEntryForm = withFormik<Props, EntryFormValues>({
  mapPropsToValues: () => {
    return {
      type: "HealthCheck",
      description: "",
      date: "",
      specialist: "",
      diagnosisCodes: [],
      // HC
      healthCheckRating: 1,
      // HOSPITAL
      discharge: {
        date: "",
        criteria: ""
      },
      //OH
      employerName: "",
      sickLeave: {
        startDate: "",
        endDate: ""
      }
    };
  },

  validate: (values) => {
    const requiredError = "Field is required";
    const errors: { [field: string]: string | Record<string,unknown> } = {};
    if (!values.description) {
      errors.description = requiredError;
    }
    if (!dateRegex.test(values.date)) {
      errors.date = "Date format doesn't match";
    }
    if (!values.date) {
      errors.date = requiredError;
    }
    if (!values.specialist) {
      errors.specialist = requiredError;
    }
    if (values.type === "HealthCheck") {
      if (values.healthCheckRating < 0 || values.healthCheckRating > 3) {
        errors.healthCheckRating = requiredError;
      }
    }
    if (values.type === "Hospital") {
      const discharge: { [field: string]: string | Record<string,unknown> } = { date: "", criteria: ""};
      if (!dateRegex.test(values.discharge.date)) {
        discharge.date = "Date format doesn't match";
        errors.discharge = discharge;
      }
      if (!values.discharge.date) {
        discharge.date = requiredError;
        errors.discharge = discharge;
      }
      if (!values.discharge.criteria) {
        discharge.criteria = requiredError;
        errors.discharge = discharge;
      }
      if (Object.values(discharge).join('') === "") {
        delete errors.discharge;
      }
    }
    if (values.type === "OccupationalHealthcare") {
      if (!values.employerName) {
        errors.employerName = requiredError;
      }
      if (values.sickLeave !== undefined) {
        if (values.sickLeave.startDate !== undefined || values.sickLeave.endDate !== undefined) {
          const sickLeave: { [field: string]: string | Record<string,unknown> } = { startDate: "", endDate: ""};
          if (!dateRegex.test(values.sickLeave.startDate)) {
            sickLeave.startDate = "Date format doesn't match";
            errors.sickLeave = sickLeave;
          }
          if (values.sickLeave.startDate === "") {
            sickLeave.startDate = "";
            errors.sickLeave = sickLeave;
          }
          if (!dateRegex.test(values.sickLeave.endDate)) {
            sickLeave.endDate = "Date format doesn't match";
            errors.sickLeave = sickLeave;
          }
          if (values.sickLeave.endDate === "") {
            sickLeave.endDate = "";
            errors.sickLeave = sickLeave;
          }
          if (Object.values(sickLeave).join('') === "") {
            delete errors.sickLeave;
          }
        }
      }
    }

    return errors;
  },
  handleSubmit: (values, formikBag) => {
    formikBag.props.onSubmit(values);
  }
})(EnhancedAddEntryForm);

export default AddEntryForm;
