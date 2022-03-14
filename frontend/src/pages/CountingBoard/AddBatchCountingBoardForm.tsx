import React from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import DataService from "../../services/countingBoard.service";

const initialValues = {
  initString: "",
  startNumber: "",
  endNumber: "",
};

export default function AddBatchCountingBoardForm(props: any) {
  const { processFormData, setOpenPopup } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("initString" in fieldValues) temp.initString = fieldValues.initString.length > 0 ? "" : "This field is required.";
    if ("startNumber" in fieldValues) temp.startNumber = fieldValues.startNumber > 0 ? "" : "Starting number need to be 1 or larger.";
    if ("endNumber" in fieldValues) temp.endNumber = fieldValues.endNumber > 1 ? "" : "Ending number need to be 2 or larger.";
    setDataErrors("");
    setErrors({
      ...temp,
    });

    if (fieldValues === values) return Object.values(temp).every((x) => x === "");
  };

  const { values, errors, setErrors, dataErrors, setDataErrors, handleInputChange } = useForm(initialValues, true, validate);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      let sn = parseInt(values.startNumber, 10);
      let en = parseInt(values.endNumber, 10);
      if (!isNaN(sn) && !isNaN(en) && en > sn) {
        DataService.checkUserInput(values).then(
          (response) => {
            processFormData(values, setDataErrors);
          },
          (error) => {
            setDataErrors(error.response.data.message);
          }
        );
      } else {
        event.preventDefault();
        setDataErrors("Ending number need to be larger than starting number.");
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid
        container
        style={{
          paddingTop: "2px",
          paddingRight: "15px",
          marginBottom: "1em",
          width: "400px",
          border: "1px solid grey",
        }}
      >
        <Grid item xs={12}>
          <Controls.Input name="initString" label="String" value={values.initString} onChange={handleInputChange} error={errors.initString} autoFocus />
          <Controls.Input
            name="startNumber"
            label="Starting Number:"
            value={values.startNumber}
            type="number"
            onChange={handleInputChange}
            onKeyPress={(event: React.KeyboardEvent) => (event?.key === "-" || event?.key === "+" || event?.key === "." || event?.key === "e") && event.preventDefault()}
            error={errors.startNumber}
          />
          <Controls.Input
            name="endNumber"
            label="Ending Number:"
            value={values.endNumber}
            type="number"
            onChange={handleInputChange}
            onKeyPress={(event: React.KeyboardEvent) => (event?.key === "-" || event?.key === "+" || event?.key === "." || event?.key === "e") && event.preventDefault()}
            error={errors.endNumber}
          />
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
