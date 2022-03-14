import { Paper, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fafafa",
    display: "flex",
    marginBottom: theme.spacing(1),
  },
  pageTitle: {
    color: "DodgerBlue",
  },
}));

export default function PageTitle(props: any) {
  const classes = useStyles();
  const { title } = props;
  return (
    <Paper elevation={0} square className={classes.root}>
      <div className={classes.pageTitle}>
        <Typography noWrap variant="h6" component="div">
          {title}
        </Typography>
      </div>
    </Paper>
  );
}
