import React, { useState, useEffect } from "react";
import { Paper, Checkbox, makeStyles, TableBody, TableRow, TableCell, Toolbar, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import AddBatchIcon from "@material-ui/icons/CloudDownload";
import DeleteIcon from "@material-ui/icons/Delete";
import RefreshIcon from "@material-ui/icons/Autorenew";
import EditIcon from "@material-ui/icons/EditOutlined";
import PrintIcon from "@material-ui/icons/Print";
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import Popup from "../../components/Popup";
import UserForm from "./UserForm";
import AddBatchUserForm from "./AddBatchUserForm";
import PageTitle from "../../components/PageTitle";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import SearchInput from "../../components/SearchInput";
import CircularIndeterminate from "../../components/CircularIndeterminate";
import DataService from "../../services/user.service";
import ElectionService from "../../services/election.service";
import Order from "../../types/order.type";
import IUser from "../../types/user.type";
import IElection from "../../types/election.type";
import IUserInput from "../../types/userInput.type";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(0),
    padding: theme.spacing(0),
  },
  searchBar: {
    width: "40%",
    height: "40px",
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: "12px",
    paddingRight: "8px",
    borderBottom: "black solid 1px",
    height: "30px",
  },
  election: {
    color: "#21b6ae",
    fontWeight: 300,
    fontSize: "1.2rem",
  },
}));

const headCells = [
  {
    id: "username",
    label: "User Name",
  },
  {
    id: "userCode",
    label: "User Code",
  },
  {
    id: "status",
    label: "Status",
  },
  {
    id: "action",
    label: "Action",
    disableSorting: true,
  },
];

const UserView = () => {
  const classes = useStyles();
  const [election, setElection] = useState<IElection | undefined>(undefined);
  const [records, setRecords] = useState<IUser[]>([]);
  const [count, setCount] = useState(0);
  const [originalRecords, setOriginalRecords] = useState<IUser[]>([]);
  const [recordForEdit, setRecordForEdit] = useState<IUser | undefined>(undefined);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState("username");
  const [selected, setSelected] = useState<number[]>([]);
  const [searched, setSearched] = useState("");
  const [page, setPage] = useState(0);
  const pages = [5, 10, 25];
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openAddEditPopup, setOpenAddEditPopup] = useState(false);
  const [openAddBatchPopup, setOpenAddBatchPopup] = useState(false);
  const [addEditPopupTitle, setAddEditPopupTitle] = useState("");
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState<any>({
    isOpen: false,
    message: "",
    type: "",
  });

  const [confirmDialog, setConfirmDialog] = useState<any>({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const addBatchPopupTitle = (
    <div>
      <p>
        Please type in the initial string, starting number, ending number.
        <br />
        For example string:Station, starting number:1, ending number:10.
        <br />
        This will create 10 users with name Station1 to Station10!
      </p>
    </div>
  );
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting, handleClick } = useTable(
    records,
    count,
    headCells,
    selected,
    setSelected,
    page,
    setPage,
    pages,
    rowsPerPage,
    setRowsPerPage,
    order,
    setOrder,
    orderBy,
    setOrderBy
  );

  const requestSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    let searchedVal = event.target.value;
    setSearched(searchedVal);
    if (originalRecords.length > 0) {
      const filteredRows = originalRecords.filter((x) => {
        return x.username.toLowerCase().includes(searchedVal.toLowerCase()) || x.userCode.toLowerCase().includes(searchedVal.toLowerCase());
      });
      setPage(0);
      setRecords(filteredRows);
      setCount(filteredRows.length);
      setSelected([]);
    }
  };

  const cancelSearch = () => {
    setSearched("");
    setPage(0);
    setRecords(originalRecords);
    setCount(originalRecords.length);
    setSelected([]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    ElectionService.getCurrentElection()
      .then((response) => {
        setLoading(false);
        if (response.data.id) {
          setElection(response.data);
          setRecords(response.data.users);
          setCount(response.data.users.length);
          setOriginalRecords(response.data.users);
          setSearched("");
          setSelected([]);
        }
      })
      .catch((e) => {
        setNotify({
          isOpen: true,
          message: "Record(s) loading failed. Check your internet connection.",
          type: "error",
        });
      });
  };

  const openInAddEditPopup = (item: IUser) => {
    setAddEditPopupTitle("Edit Write In User");
    setRecordForEdit(item);
    setOpenAddEditPopup(true);
  };

  const handleDelete = () => {
    if (selected.length > 0) {
      setConfirmDialog({
        isOpen: true,
        title: "Are you sure to delete selected record(s)?",
        subTitle: "You can't undo this operation",
        onConfirm: () => {
          setConfirmDialog({
            ...confirmDialog,
            isOpen: false,
          });
          DataService.removeBatch(selected)
            .then(() => {
              setNotify({
                isOpen: true,
                message: "Record(s) Deleted Successfully",
                type: "success",
              });
              setPage(0);
              loadData();
            })
            .catch((e) => {
              setNotify({
                isOpen: true,
                message: "Record(s) Delete Action Failed. You need to remove related write in records first. or records have been deleted already.",
                type: "error",
              });
            });
        },
      });
    } else {
      setNotify({
        isOpen: true,
        message: "Nothing is selected",
        type: "warning",
      });
    }
  };

  const handlePrint = () => {
    if (selected.length > 0) {
      DataService.printBatch(selected)
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          const pdfWindow = window.open();
          if (pdfWindow) pdfWindow.location.href = fileURL;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setNotify({
        isOpen: true,
        message: "Nothing is selected",
        type: "warning",
      });
    }
  };

  const processFormData = (entity: IUser, setDataErrors: any) => {
    if (entity.id) {
      DataService.update(entity.id, entity)
        .then(() => {
          setDataErrors("");
          setOpenAddEditPopup(false);
          setRecordForEdit(undefined);
          setNotify({
            isOpen: true,
            message: "Record Updated Successfully",
            type: "success",
          });
          loadData();
        })
        .catch((e) => {
          setDataErrors("Failed to update the record due to database constrain.");
        });
    } else {
      if (election) {
        DataService.create(election.id, entity)
          .then(() => {
            setDataErrors("");
            setOpenAddEditPopup(false);
            setRecordForEdit(undefined);
            setNotify({
              isOpen: true,
              message: "Record Added Successfully",
              type: "success",
            });
            loadData();
          })
          .catch((e) => {
            setDataErrors("Failed to create the record due to database constrain.");
          });
      }
    }
  };

  const processBatchData = (entity: IUserInput, setDataErrors: any) => {
    setProcessing(true);
    if (election) {
      DataService.createBatch(election.id, entity)
        .then(() => {
          setProcessing(false);
          setDataErrors("");
          setOpenAddBatchPopup(false);
          setRecordForEdit(undefined);
          setNotify({
            isOpen: true,
            message: "Batch Records Added Successfully",
            type: "success",
          });
          loadData();
        })
        .catch((e) => {
          setDataErrors("Failed to create the record due to database constrain.");
        });
    }
  };

  return (
    <>
      <PageTitle title="Write In User" />
      <Typography className={classes.election} noWrap={true}>
        Current Election: {election ? election.title : "Check election list and make sure there is one in use!"}
      </Typography>
      <Paper className={classes.pageContent}>
        <Toolbar className={classes.toolBar}>
          <SearchInput className={classes.searchBar} label="Search by username and user code" value={searched} name={searched} onChange={requestSearch} onClear={cancelSearch} />
          {election && (
            <div>
              <Controls.ActionButton
                text="Reload"
                startIcon={<RefreshIcon />}
                toolTip="Reload records from database"
                onClick={() => {
                  setPage(0);
                  loadData();
                }}
              />
              <Controls.ActionButton
                text="Add"
                startIcon={<AddIcon />}
                toolTip="Add a record"
                onClick={() => {
                  setAddEditPopupTitle("Add Write In User");
                  setOpenAddEditPopup(true);
                  setRecordForEdit(undefined);
                }}
              />
              <Controls.ActionButton
                text="Add By Batch"
                startIcon={<AddBatchIcon />}
                toolTip="Add a batch of records based on input"
                onClick={() => {
                  setOpenAddBatchPopup(true);
                  setRecordForEdit(undefined);
                }}
              />
              <Controls.ActionButton
                text="Delete"
                startIcon={<DeleteIcon />}
                toolTip="Delete selected record(s)"
                onClick={() => {
                  handleDelete();
                }}
              />
              <Controls.ActionButton
                text="Print"
                startIcon={<PrintIcon />}
                toolTip="Print selected record or records"
                onClick={() => {
                  handlePrint();
                }}
              />
            </div>
          )}
        </Toolbar>
        <TblContainer>
          <TblHead />
          {records.length > 0 && (
            <TableBody>
              {recordsAfterPagingAndSorting().map((item: any, index) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" onClick={(event) => handleClick(event, item.id)} checked={selected.indexOf(item.id) !== -1} />
                    </TableCell>
                    <TableCell width="40%">{item.username}</TableCell>
                    <TableCell>{item.userCode}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      <Controls.ActionButton
                        text="Edit"
                        startIcon={<EditIcon />}
                        toolTip="Edit this record"
                        onClick={() => {
                          openInAddEditPopup(item);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </TblContainer>
        <TblPagination />
        {loading && <CircularIndeterminate />}
      </Paper>
      <Popup title={addEditPopupTitle} openPopup={openAddEditPopup} setOpenPopup={setOpenAddEditPopup}>
        <UserForm recordForEdit={recordForEdit} processFormData={processFormData} setOpenPopup={setOpenAddEditPopup} />
      </Popup>
      <Popup title={addBatchPopupTitle} openPopup={openAddBatchPopup} setOpenPopup={setOpenAddBatchPopup} processing={processing}>
        <AddBatchUserForm recordForEdit={recordForEdit} processFormData={processBatchData} setOpenPopup={setOpenAddBatchPopup} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  );
};
export default UserView;
