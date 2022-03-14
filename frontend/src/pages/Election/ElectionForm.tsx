import React, { useEffect } from "react";
import { Grid, MenuItem } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
// import IElection from "../../types/election.type";

const options = [{ status: "PrePublished" }, { status: "Published" }, { status: "Locked" }];

const initialValues = {
  title: "",
  code: "",
  electionDate: new Date(),
  defaultTag: false,
  status: "",
};

export default function ElectionForm(props: any) {
  const { processFormData, recordForEdit, setOpenPopup } = props;

  useEffect(() => {
    recordForEdit && setValues({ ...recordForEdit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordForEdit]);

  const validate = (fieldValues = values) => {
    let temp: any = { ...errors };
    if ("title" in fieldValues) temp.title = fieldValues.title ? "" : "This field is required.";
    if ("code" in fieldValues) temp.code = fieldValues.code ? "" : "This field is required.";
    if ("status" in fieldValues) temp.status = fieldValues.status ? "" : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues === values) return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, dataErrors, setDataErrors, handleInputChange } = useForm(initialValues, true, validate);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      processFormData(values, setDataErrors);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid
        container
        style={{
          paddingTop: "2px",
          marginBottom: "1em",
          width: "700px",
          border: "1px solid grey",
        }}
      >
        <Grid
          item
          xs={6}
          style={{
            paddingTop: "2px",
            paddingRight: "15px",
            width: "300px",
          }}
        >
          <Controls.Input name="title" label="Title" value={values.title} onChange={handleInputChange} error={errors.title} autoFocus />
          <Controls.Input name="code" label="Code" value={values.code} onChange={handleInputChange} error={errors.code} />
          <Controls.DatePicker name="electionDate" label="Election Date" value={values.electionDate} onChange={handleInputChange} error={errors.electionDate} />
        </Grid>
        <Grid
          item
          xs={6}
          style={{
            paddingTop: "2px",
            paddingRight: "15px",
            width: "300px",
          }}
        >
          <Controls.Checkbox name="defaultTag" label="In Use" value={values.defaultTag} onChange={handleInputChange} />
          <Controls.Input name="status" label="Status" value={values.status} onChange={handleInputChange} error={errors.status} select>
            {options.map((option) => (
              <MenuItem key={option.status} value={option.status}>
                {option.status}
              </MenuItem>
            ))}
          </Controls.Input>
        </Grid>
        <Grid item xs={12}>
          <div style={{ paddingLeft: "10px", color: "red" }}>{dataErrors ? dataErrors : " "}</div>
        </Grid>
      </Grid>
      <Grid container justifyContent="flex-end">
        <Grid item xs={12}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Controls.DialogButton type="submit" text="Submit" />
            <Controls.DialogButton
              text="Cancel"
              color="default"
              onClick={() => {
                setOpenPopup(false);
              }}
            />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
