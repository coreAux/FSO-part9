import React from "react";
import { ErrorMessage, Field, FieldProps, FormikProps, /*useField */} from "formik";
import { Dropdown, DropdownProps, Form, Rating, RatingProps } from "semantic-ui-react";
import { Diagnosis, Gender } from "../types";
import { HEALTHBAR_TEXTS } from "../components/HealthRatingBar";

// structure of a single option
export type GenderOption = {
  value: Gender;
  label: string;
};

// props for select field component
type SelectFieldProps = {
  name: string;
  label: string;
  options: GenderOption[];
};

export const SelectField = ({
  name,
  label,
  options
}: SelectFieldProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field as="select" name={name} className="ui dropdown">
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </Field>
  </Form.Field>
);

interface TextProps extends FieldProps {
  label: string;
  placeholder: string;
}

export const TextField= ({
  field,
  label,
  placeholder
}: TextProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field placeholder={placeholder} {...field} />
    <div style={{ color:'red' }}>
      <ErrorMessage name={field.name} />
    </div>
  </Form.Field>
);

/*
  for exercises 9.24.-
*/
interface NumberProps extends FieldProps {
  label: string;
  errorMessage?: string;
  min: number;
  max: number;
}

export const NumberField = ({ field, label, min, max } : NumberProps ) => (
  <Form.Field>
    <label>{label}</label>
    <Field {...field} type='number' min={min} max={max} />

    <div style={{ color:'red' }}>
      <ErrorMessage name={field.name} />
    </div>
  </Form.Field>
);

export const HeartRatingField = ({
  setFieldValue,
  setFieldTouched
}: {
  setFieldValue: FormikProps<{ diagnosisCodes: string[] }>["setFieldValue"];
  setFieldTouched: FormikProps<{ diagnosisCodes: string[] }>["setFieldTouched"];
}) => {
  const [rating, setRating] = React.useState<number>(1);
  const field = "healthCheckRating";
  const onChange = (
    _event: React.SyntheticEvent<HTMLElement, Event>,
    data: RatingProps
  ) => {
    const correctedRating = 4 - Number(data.rating);
    setFieldTouched(field, true);
    setFieldValue(field, correctedRating);
    setRating(correctedRating);
  };


  return (
    <Form.Field>
      <label>Health Check Rating</label>
      <Rating
        icon='heart'
        defaultRating={1}
        maxRating={4}
        size="huge"
        onRate={onChange}
      />
      <p>{HEALTHBAR_TEXTS[rating]}</p>
      <ErrorMessage name={field} />
    </Form.Field>
  );
};

export const DiagnosisSelection = ({
  diagnoses,
  setFieldValue,
  setFieldTouched
}: {
  diagnoses: Diagnosis[];
  setFieldValue: FormikProps<{ diagnosisCodes: string[] }>["setFieldValue"];
  setFieldTouched: FormikProps<{ diagnosisCodes: string[] }>["setFieldTouched"];
}) => {
  const field = "diagnosisCodes";
  const onChange = (
    _event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    setFieldTouched(field, true);
    setFieldValue(field, data.value);
  };

  const stateOptions = diagnoses.map(diagnosis => ({
    key: diagnosis.code,
    text: `${diagnosis.name} (${diagnosis.code})`,
    value: diagnosis.code
  }));

  return (
    <Form.Field>
      <label>Diagnoses</label>
      <Dropdown
        fluid
        multiple
        search
        selection
        options={stateOptions}
        onChange={onChange}
      />
      <ErrorMessage name={field} />
    </Form.Field>
  );
};
