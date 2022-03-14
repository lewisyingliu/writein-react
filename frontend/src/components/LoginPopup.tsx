import { Dialog, DialogTitle, DialogContent, LinearProgress, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    paddingTop: theme.spacing(6),
    backgroundColor: "DodgerBlue",
    color: "white",
  },
}));

export default function Popup(props: any) {
  const { processing, title, children, openPopup } = props;
  const classes = useStyles();

  return (
    <Dialog open={openPopup} maxWidth="sm">
      {processing ? <LinearProgress></LinearProgress> : null}
      <DialogTitle className={classes.dialogTitle}>
        <Typography style={{ fontSize: 45, fontStyle: "bold", color: "white" }}>{title}</Typography>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
