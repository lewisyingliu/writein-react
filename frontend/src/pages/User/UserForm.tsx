import React, { useEffect } from "react";
import { Grid, MenuItem } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import DataService from "../../services/user.service";

const options = [{ status: "Active" }, { status: "Archived" }, { status: "Locked" }];

const initialValues = {
  username: "",
  userCode: "",
  status: "Active",
};

export default function UserForm(props: any) {
  const { processFormData, recordForEdit, setOpenPopup } = props;

  useEffect(() => {
    recordForEdit && setValues({ ...recordForEdit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("username" in fieldValues) temp.username = fieldValues.username.length > 4 ? "" : "Minimum characters is 5.";
    if ("userCode" in fieldValues) temp.userCode = fieldValues.userCode.length > 4 ? "" : "Minimum characters is 5.";
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
      if (!recordForEdit) {
        DataService.checkUsername(values.username).then(
          (response) => {
            processFormData(values, setDataErrors);
          },
          (error) => {
            setDataErrors(error.response.data.message);
          }
        );
      } else {
        processFormData(values, setDataErrors);
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
          <Controls.Input name="username" label="User Name" value={values.username} onChange={handleInputChange} error={errors.username} autoComplete="off" autoFocus />
          <Controls.Input name="userCode" label="User Code" value={values.userCode} onChange={handleInputChange} error={errors.userCode} autoComplete="off" />
          <Controls.Input name="status" label="Status" value={values.status == null ? "" : values.status} onChange={handleInputChange} error={errors.status} select>
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
