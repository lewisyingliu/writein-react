import { Button as MuiButton, makeStyles, Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    height: "30px",
  },
  label: {
    textTransform: "none",
    color: "DodgerBlue",
    fontWeight: "bold",
  },
}));

export default function ActionButton(props: any) {
  const { text, size, color, toolTip, variant, onClick, ...other } = props;
  const classes = useStyles();

  return (
    <Tooltip title={toolTip || " "}>
      <span>
        <MuiButton
          variant={variant || "outlined"}
          size={size || "small"}
          color={color || "default"}
          onClick={onClick}
          {...other}
          classes={{ root: classes.root, label: classes.label }}
        >
          {text}
        </MuiButton>
      </span>
    </Tooltip>
  );
}
