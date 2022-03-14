import React, { useState, useEffect } from "react";
import { Paper, Checkbox, makeStyles, TableBody, TableRow, TableCell, Toolbar } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import RefreshIcon from "@material-ui/icons/Autorenew";
import EditIcon from "@material-ui/icons/EditOutlined";
import useTable from "../../components/useTable";
import PageTitle from "../../components/PageTitle";
import Controls from "../../components/controls/Controls";
import Popup from "../../components/Popup";
import AdminUserForm from "./AdminUserForm";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import SearchInput from "../../components/SearchInput";
import DataService from "../../services/adminUser.service";
import IUser from "../../types/user.type";
import Order from "../../types/order.type";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(0),
    padding: theme.spacing(0),
  },
  searchBar: {
    width: "60%",
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
}));

const headCells = [
  {
    id: "username",
    label: "User Name",
  },
  {
    id: "firstName",
    label: "First Name",
  },
  {
    id: "lastName",
    label: "Last Name",
  },
  {
    id: "email",
    label: "Email",
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
const AdminUserView = () => {
  const classes = useStyles();
  const [records, setRecords] = useState<IUser[]>([]);
  const [count, setCount] = useState(0);
  const [originalRecords, setOriginalRecords] = useState<IUser[]>([]);
  const [recordForEdit, setRecordForEdit] = useState<IUser | undefined>(undefined);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState("title");
  const [selected, setSelected] = useState<number[]>([]);
  const [searched, setSearched] = useState("");
  const [page, setPage] = useState(0);
  const pages = [5, 10, 25];
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
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
      const filteredRows = originalRecords.filter((x) => {
        return (
          x.username.toLowerCase().includes(searchedVal.toLowerCase()) ||
          x.firstName.toLowerCase().includes(searchedVal.toLowerCase()) ||
          x.lastName.toLowerCase().includes(searchedVal.toLowerCase()) ||
          x.email.toLowerCase().includes(searchedVal.toLowerCase())
        );
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
    DataService.getAll()
      .then((response) => {
        setRecords(response.data);
        setCount(response.data.length);
        setOriginalRecords(response.data);
        setSearched("");
        setSelected([]);
      })
      .catch((e) => {
        setNotify({
          isOpen: true,
          message: "Record(s) loading failed. Check your internet connection.",
          type: "error",
        });
      });
  };

  const openInPopup = (item: IUser) => {
    setPopupTitle("Edit Admin User");
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
              loadData();
            })
            .catch((error) => {
              setNotify({
                isOpen: true,
                message: "Record(s) Delete Action Failed. Status Code:" + error.response.status,
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

  const processFormData = (entity: IUser, setDataErrors: any) => {
    if (entity.id) {
      DataService.update(entity.id, entity)
        .then(() => {
          setDataErrors("");
          setRecordForEdit(undefined);
          setOpenPopup(false);
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
      DataService.create(entity)
        .then(() => {
          setDataErrors("");
          setRecordForEdit(undefined);
          setOpenPopup(false);
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
      <PageTitle title="Admin User" />
      <Paper className={classes.pageContent}>
        <Toolbar className={classes.toolBar}>
          <SearchInput
            className={classes.searchBar}
            label="Search by username, first name, last name and email"
            value={searched}
            name={searched}
            onChange={requestSearch}
            onClear={cancelSearch}
          />
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
                setPopupTitle("Add Admin User");
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
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.firstName}</TableCell>
                    <TableCell>{item.lastName}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      <Controls.ActionButton
                        text="Edit"
                        startIcon={<EditIcon />}
                        toolTip="Edit this record"
                        onClick={() => {
                          openInPopup(item);
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
      </Paper>
      <Popup title={popupTitle} openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <AdminUserForm recordForEdit={recordForEdit} processFormData={processFormData} setOpenPopup={setOpenPopup} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  );
};
export default AdminUserView;
