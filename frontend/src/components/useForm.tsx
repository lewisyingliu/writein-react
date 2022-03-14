import { useState } from "react";
import { makeStyles } from "@material-ui/core";

export function useForm(initialValues: any, validateOnChange = false, validate: any) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<any>({});
  const [dataErrors, setDataErrors] = useState("");
  const [isEdit, setIsEdit] = useState(true);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    if (validateOnChange) validate({ [name]: value });
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    dataErrors,
    setDataErrors,
    isEdit,
    setIsEdit,
    handleInputChange,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      width: "100%",
      margin: theme.spacing(1),
    },
  },
}));

export function Form(props: any) {
  const classes = useStyles();
  const { children, ...other } = props;
  return (
    <form className={classes.root} autoComplete="off" {...other}>
      {props.children}
    </form>
  );
}
