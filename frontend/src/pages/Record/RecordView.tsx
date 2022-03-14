import React, { useState, useEffect, useCallback } from "react";
import { Paper, Checkbox, makeStyles, TableBody, TableRow, TableCell, Toolbar, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import RefreshIcon from "@material-ui/icons/Autorenew";
import EditIcon from "@material-ui/icons/EditOutlined";
import PdfIcon from "@material-ui/icons/PictureAsPdf";
import ExcelIcon from "@material-ui/icons/GetApp";
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import Popup from "../../components/Popup";
import RecordForm from "./RecordForm";
import PageTitle from "../../components/PageTitle";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import SearchInput from "../../components/SearchInput";
import CircularIndeterminate from "../../components/CircularIndeterminate";
import DataService from "../../services/record.service";
import ElectionService from "../../services/election.service";
import { debounce } from "../../common/CommonFunctions";
import IWriteInRecord from "../../types/writeInRecord.type";
import IElection from "../../types/election.type";
import Order from "../../types/order.type";
import { DataProps, RequestProps } from "../../types/common.type";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(0),
    padding: theme.spacing(0),
  },
  searchBar: {
    width: "40%",
    height: "40px",
  },
  actionBar: {
    display: "flex",
    flexDirection: "row",
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
    id: "office",
    label: "Office",
    disableSorting: true,
  },
  {
    id: "countingBoard",
    label: "Counting Board",
    disableSorting: true,
  },
  {
    id: "batchNumber",
    label: "Batch Number",
    disableSorting: true,
  },
  {
    id: "firstName",
    label: "First Name",
    disableSorting: true,
  },
  {
    id: "middleName",
    label: "Middle Name",
    disableSorting: true,
  },
  {
    id: "lastName",
    label: "Last Name",
    disableSorting: true,
  },
  {
    id: "creatorName",
    label: "Creator Name",
    disableSorting: true,
  },
  {
    id: "createAt",
    label: "Created At",
    disableSorting: true,
  },
  {
    id: "action",
    label: "Action",
    disableSorting: true,
  },
];

const RecordView = () => {
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const [election, setElection] = useState<IElection | undefined>(undefined);
  const [records, setRecords] = useState<IWriteInRecord[]>([]);
  const [recordForEdit, setRecordForEdit] = useState<IWriteInRecord | undefined>(undefined);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState("createAt");
  const [selected, setSelected] = useState<number[]>([]);
  const [searched, setSearched] = useState("");
  const [page, setPage] = useState(0);
  const pages = [5, 10, 25];
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);
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

  const { TblContainer, TblHead, TblPagination, handleClick } = useTable(
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(
    debounce(function (value) {
      if (election) {
        let dataProps: DataProps = {
          electionId: election.id,
          filterText: value,
          actionType: "search",
        };
        getData(dataProps);
      }
    }, 800),
    [election]
  );

  const requestSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearched(event.target.value);
    debounceSearch(event.target.value);
  };

  const getData = (props: DataProps) => {
    let params;
    let requestProps: RequestProps;
    if (props.filterText && props.actionType && props.actionType === "search") {
      requestProps = {
        filterText: props.filterText,
        page: 0,
        rowsPerPage: rowsPerPage,
      };
    } else if (props.actionType && props.actionType === "refresh") {
      requestProps = {
        filterText: "",
        page: 0,
        rowsPerPage: rowsPerPage,
      };
    } else {
      requestProps = {
        filterText: props.filterText,
        page: page,
        rowsPerPage: rowsPerPage,
      };
    }
    params = getRequestParams(requestProps);
    setLoading(true);
    DataService.getWriteInByElection(props.electionId, params)
      .then((response) => {
        const { records, currentPage, totalItems } = response.data;
        setPage(currentPage);
        setRecords(records);
        setSelected([]);
        setCount(totalItems);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  const getRequestParams = (props: RequestProps) => {
    let params: any = {};

    if (props.filterText) {
      params["filter"] = props.filterText;
    }

    if (props.page) {
      params["page"] = props.page;
    }

    if (props.rowsPerPage) {
      params["size"] = props.rowsPerPage;
    }

    return params;
  };

  useEffect(() => {
    loadData();
    return () => {
      setRecords([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const loadData = () => {
    setLoading(true);
    ElectionService.getCurrentElection()
      .then((response) => {
        setLoading(false);
        if (response.data.id) {
          setElection(response.data);
          setOffices(response.data.offices);
          const dataProps: DataProps = {
            electionId: response.data.id,
            filterText: searched,
          };
          getData(dataProps);
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

  const refreshData = () => {
    ElectionService.getCurrentElection()
      .then((response) => {
        setElection(response.data);
        setOffices(response.data.offices);
        setSearched("");
        const dataProps: DataProps = {
          electionId: response.data.id,
          filterText: "",
          actionType: "refresh",
        };
        getData(dataProps);
      })
      .catch((e) => {
        setNotify({
          isOpen: true,
          message: "Record(s) loading failed. Check your internet connection.",
          type: "error",
        });
      });
  };

  const openInEditPopup = (item: IWriteInRecord) => {
    setPopupTitle("Edit Write In Record");
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
              refreshData();
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

  const handlePdfPrint = () => {
    if (election) {
      DataService.printPdf(election.id)
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          const pdfWindow = window.open();
          if (pdfWindow) pdfWindow.location.href = fileURL;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleExcelExport = () => {
    DataService.exportToCSV()
      .then((response) => {
        const file = new Blob([response.data], { type: "text/csv" });
        const a = document.createElement("a");
        a.download = "writeins.csv";
        a.href = URL.createObjectURL(file);
        const clickEvt = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        a.dispatchEvent(clickEvt);
        a.remove();
      })
      .catch((e) => console.log(e));
  };

  const processFormData = (entity: IWriteInRecord, setDataErrors: any) => {
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
  };

  return (
    <>
      <PageTitle title="Write In Records" />
      <Typography className={classes.election} noWrap={true}>
        Current Election: {election ? election.title : "Check election list and make sure there is one in use!"}
      </Typography>
      <Paper className={classes.pageContent}>
        <Toolbar className={classes.toolBar}>
          <SearchInput className={classes.searchBar} label="Search by fields" value={searched} name={searched} onChange={requestSearch} onClear={refreshData} />
          {election && (
            <div className={classes.actionBar}>
              <Controls.ActionButton text="Export Report as Excel" startIcon={<ExcelIcon />} toolTip="Export report to CSV format" onClick={handleExcelExport} />
              <Controls.ActionButton
                text="Export Report as PDF"
                startIcon={<PdfIcon />}
                toolTip="Export report to PDF, then you can print the report"
                onClick={() => {
                  handlePdfPrint();
                }}
              />
              <Controls.ActionButton text="Reload" startIcon={<RefreshIcon />} toolTip="Reload records from database" onClick={refreshData} />
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
          {count > 0 && (
            <TableBody>
              {records.map((item: any, index) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" onClick={(event) => handleClick(event, item.id)} checked={selected.indexOf(item.id) !== -1} />
                    </TableCell>
                    <TableCell>{item.office.title}</TableCell>
                    <TableCell>{item.countingBoard.title}</TableCell>
                    <TableCell>{item.batchNumber}</TableCell>
                    <TableCell>{item.firstName}</TableCell>
                    <TableCell>{item.middleName}</TableCell>
                    <TableCell>{item.lastName}</TableCell>
                    <TableCell>{item.creatorName}</TableCell>
                    <TableCell>
                      <span>{item.createdAt}</span>
                    </TableCell>
                    <TableCell>
                      <Controls.ActionButton
                        text="Edit"
                        startIcon={<EditIcon />}
                        toolTip="Edit this record"
                        onClick={() => {
                          openInEditPopup(item);
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
        <RecordForm recordForEdit={recordForEdit} processFormData={processFormData} setOpenPopup={setOpenPopup} offices={offices} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  );
};
export default RecordView;
