import React, { useEffect, useState } from "react";
import { Grid, MenuItem } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";

const initialValues = {
  office: "",
  countingBoard: "",
  batchNumber: "",
  firstName: "",
  middleName: "",
  lastName: "",
};

export default function RecordForm(props: any) {
  const { processFormData, recordForEdit, setOpenPopup, offices } = props;
  const [countingBoards, setCountingBoards] = useState([]);
  const [office, setOffice] = useState(undefined);
  const [countingBoard, setCountingBoard] = useState(undefined);

  useEffect(() => {
    recordForEdit && setValues({ ...recordForEdit });
    if (recordForEdit && offices.length > 0) {
      for (let i = 0; i < offices.length; i++) {
        if (offices[i].id === recordForEdit.office.id) {
          setOffice(offices[i]);
          setCountingBoards(offices[i].countingBoards);
          for (let j = 0; j < offices[i].countingBoards.length; j++) {
            if (offices[i].countingBoards[j].id === recordForEdit.countingBoard.id) {
              setCountingBoard(offices[i].countingBoards[j]);
            }
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("office" in fieldValues) temp.office = office ? "" : "This field is required.";
    if ("countingBoard" in fieldValues) temp.countingBoard = countingBoard ? "" : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues === values) return Object.values(temp).every((x) => x === "");
  };

  const onChange = (event: any) => {
    const value = event.target.value;
    if (event.target.name === "office") {
      setOffice(value);
      setCountingBoards(value.countingBoards);
    }
    if (event.target.name === "countingBoard") {
      setCountingBoard(value);
    }
  };

  const { values, setValues, errors, setErrors, dataErrors, setDataErrors, handleInputChange } = useForm(initialValues, true, validate);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      let name = values.firstName.trim() + values.middleName + values.lastName;
      if (name !== undefined && name.length > 0) {
        values.office = office;
        values.countingBoard = countingBoard;
        processFormData(values, setDataErrors);
      } else {
        setDataErrors("You need input at least one of three name fields, First Name, Middle Name, Last Name!");
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
          <Controls.Input name="office" label="Office" size="medium" autoFocus defaultValue="" value={office ? office : ""} onChange={onChange} error={errors.office} select>
            {offices.map((office: any) => (
              <MenuItem key={office.id} value={office}>
                {office.title}
              </MenuItem>
            ))}
          </Controls.Input>
          <Controls.Input
            name="countingBoard"
            label="Counting Board"
            size="medium"
            onChange={onChange}
            defaultValue=""
            value={countingBoard ? countingBoard : ""}
            error={errors.countingBoard}
            select
          >
            {countingBoards.map((countingBoard: any) => (
              <MenuItem key={countingBoard.id} value={countingBoard}>
                {countingBoard.title}
              </MenuItem>
            ))}
          </Controls.Input>
          <Controls.Input name="batchNumber" label="Batch Number" size="medium" onChange={handleInputChange} value={values.batchNumber} error={errors.batchNumber} />
          <Controls.Input name="firstName" label="First Name" size="medium" onChange={handleInputChange} value={values.firstName} error={errors.firstName} />
          <Controls.Input name="middleName" label="Middle Name" size="medium" onChange={handleInputChange} value={values.middleName} error={errors.middleName} />
          <Controls.Input name="lastName" label="Last Name" size="medium" onChange={handleInputChange} value={values.lastName} error={errors.lastName} />
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
