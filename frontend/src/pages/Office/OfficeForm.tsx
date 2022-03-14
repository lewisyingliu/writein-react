import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import { isPositiveInteger } from "../../common/CommonFunctions";
import DataService from "../../services/office.service";
import ICountingBoard from "../../types/countingBoard.type";

const initialValues = {
  title: "",
  displayOrder: "",
  countingBoards: "",
};

export default function OfficeForm(props: any) {
  const { processFormData, recordForEdit, setOpenPopup, options } = props;
  const [selected, setSelected] = useState<ICountingBoard[]>([]);

  useEffect(() => {
    if (recordForEdit && recordForEdit.countingBoards.length > 0) {
      let intersections: Array<ICountingBoard> = [];
      for (let i = 0; i < recordForEdit.countingBoards.length; i++) {
        for (let j = 0; j < options.length; j++) {
          if (options[j].id === recordForEdit.countingBoards[i].id) intersections.push(options[j]);
        }
      }
      setSelected(intersections);
    }
    recordForEdit && setValues({ ...recordForEdit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("title" in fieldValues) temp.title = fieldValues.title.length > 0 ? "" : "This field is required.";
    if ("displayOrder" in fieldValues)
      if (!isPositiveInteger(fieldValues.displayOrder)) {
        setValues({
          ...values,
          displayOrder: "",
        });
      }
    temp.displayOrder = isPositiveInteger(fieldValues.displayOrder) ? "" : "This field is required.";
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
        DataService.checkTitle(values.title).then(
          () => {
            values.countingBoards = selected;
            processFormData(values, setDataErrors);
          },
          (error) => {
            setDataErrors(error.response.data.message);
          }
        );
      } else {
        values.countingBoards = selected;
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
          <Controls.Input name="title" label="Title" value={values.title} onChange={handleInputChange} error={errors.title} autoFocus />
          <Controls.Input
            name="displayOrder"
            label="Display Order"
            type="number"
            value={values.displayOrder}
            onChange={handleInputChange}
            onKeyPress={(event: React.KeyboardEvent) => (event?.key === "-" || event?.key === "+" || event?.key === "." || event?.key === "e") && event.preventDefault()}
            error={errors.displayOrder}
          />
          <Controls.MultiSelect
            name="countingBoards"
            label="Counting Boards"
            value={selected}
            options={options}
            selected={selected}
            setSelected={setSelected}
            error={errors.countingBoards}
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
