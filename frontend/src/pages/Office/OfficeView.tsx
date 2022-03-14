import React, { useState, useEffect } from "react";
import { Paper, Checkbox, makeStyles, TableBody, TableRow, TableCell, Toolbar, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import RefreshIcon from "@material-ui/icons/Autorenew";
import EditIcon from "@material-ui/icons/EditOutlined";
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import Popup from "../../components/Popup";
import OfficeForm from "./OfficeForm";
import PageTitle from "../../components/PageTitle";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import SearchInput from "../../components/SearchInput";
import CircularIndeterminate from "../../components/CircularIndeterminate";
import DataService from "../../services/office.service";
import ElectionService from "../../services/election.service";
import IOffice from "../../types/office.type";
import IElection from "../../types/election.type";
import Order from "../../types/order.type";
import ICountingBoard from "../../types/countingBoard.type";

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
    id: "title",
    label: "Title",
    disableSorting: true,
  },
  {
    id: "displayOrder",
    label: "Display Order",
  },
  {
    id: "countingBoardSize",
    label: "Counting Board QTY",
  },
  {
    id: "action",
    label: "Action",
    disableSorting: true,
  },
];

const OfficeView = () => {
  const classes = useStyles();
  const [election, setElection] = useState<IElection | undefined>(undefined);
  const [records, setRecords] = useState<IOffice[]>([]);
  const [count, setCount] = useState(0);
  const [originalRecords, setOriginalRecords] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState<IOffice | undefined>(undefined);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState("displayOrder");
  const [selected, setSelected] = useState<number[]>([]);
  const [searched, setSearched] = useState("");
  const [page, setPage] = useState(0);
  const pages = [5, 10, 25];
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [countingBoards, setCountingBoards] = useState<ICountingBoard[]>([]);
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
      const filteredRows = originalRecords.filter((x: IOffice) => {
        return x.title.toLowerCase().includes(searchedVal.toLowerCase()) || x.displayOrder.toString().includes(searchedVal.toLowerCase());
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
          setRecords(response.data.offices);
          setCount(response.data.offices.length);
          setCountingBoards(response.data.countingBoards);
          setOriginalRecords(response.data.offices);
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

  const openInAddEditPopup = (item: IOffice) => {
    setPopupTitle("Edit Office");
    setRecordForEdit(item);
    setOpenPopup(true);
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
            .catch((error) => {
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

  const processFormData = (entity: IOffice, setDataErrors: any) => {
    if (entity.id) {
      DataService.update(entity.id, entity)
        .then(() => {
          setDataErrors("");
          setOpenPopup(false);
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
    } else if (election) {
      DataService.create(election.id, entity)
        .then(() => {
          setDataErrors("");
          setOpenPopup(false);
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
  };

  return (
    <>
      <PageTitle title="Office" />
      <Typography className={classes.election} noWrap={true}>
        Current Election: {election ? election.title : "Check election list and make sure there is one in use!"}
      </Typography>
      <Paper className={classes.pageContent}>
        <Toolbar className={classes.toolBar}>
          <SearchInput className={classes.searchBar} label="Search by title and display" value={searched} name={searched} onChange={requestSearch} onClear={cancelSearch} />
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
                  setPopupTitle("Add Office");
                  setOpenPopup(true);
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
                    <TableCell width="30%">{item.title}</TableCell>
                    <TableCell>{item.displayOrder}</TableCell>
                    <TableCell>{item.countingBoards.length}</TableCell>
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
      <Popup title={popupTitle} openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <OfficeForm recordForEdit={recordForEdit} processFormData={processFormData} setOpenPopup={setOpenPopup} options={countingBoards} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  );
};
export default OfficeView;
