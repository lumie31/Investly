import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import {
  Container,
  Box,
  TextField,
  Grid,
  Paper,
  ButtonBase,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";

import Navbar from "./components/navbar";
import currentLoans from "./current_loans.json";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "20px auto",
  },
  card: {
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  button: {
    backgroundColor: "#FFEA00",
    color: "#000",
    padding: theme.spacing(1.5, 4),
    border: "1px solid #FDE800",
    borderRadius: "4px",
    textTransform: "uppercase",
    fontWeight: "500",
    fontSize: "14px",
  },
  paper: {
    backgroundColor: "#F5F5F5",
  }
}));

// function to parse string into number
const parseNumber = (num) => {
  return parseFloat(num.split(",").join(""));
};

const initialState = currentLoans.loans.map((loan) => {
  return {
    ...loan,
    available: parseNumber(loan.available),
    amount: parseNumber(loan.amount),
    term_remaining: parseNumber(loan.term_remaining),
  };
});


export default function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loans, setLoans] = useState(initialState);
  const [loanInput, setLoanInput] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [error, setError] = useState(null);

  const totalAvailable = initialState.reduce(
      (acc, curr) => (acc + curr.available), 0);

  const handleClickOpen = (loan) => {
    setOpen(true);
    setSelectedLoan(loan);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedLoan(null);
    setError(null);
    setLoanInput("");
  };

  const investAmount = () => {
    if (!loanInput || loanInput === "" || loanInput <= 0) {
      setError("Input cannot be empty");
      return;
    }
    if (parseNumber(loanInput) > selectedLoan.available) {
      setError("Your investment cannot be greater than your available amount");
      return;
    }

    let newInvestments = [...investments];
    const investmentIndex = newInvestments.findIndex(investment => investment.id === selectedLoan.id);

    let newLoans = [...loans];
    const loanIndex = newLoans.findIndex(loan => loan.id === selectedLoan.id);

    newLoans[loanIndex]["available"] = newLoans[loanIndex]["available"] - parseNumber(loanInput);
    newLoans[loanIndex]["showInvestedBadge"] = true

    if (investmentIndex !== -1) {
      newInvestments[investmentIndex]["invested"] = newInvestments[investmentIndex]["invested"] + parseNumber(loanInput);
    } else {
      newInvestments.push({
        id: selectedLoan.id,
        invested: parseNumber(loanInput)
      })
    }
    setLoans(newLoans);
    setInvestments(newInvestments);
    handleClose();
  }

  return (
    <Box>
      <Navbar />
      <Container maxWidth="sm" className={classes.root}>
        <Paper elevation={2} className={classes.paper}>
          <Box p={2}>
            <h1>Current Loans</h1>
            <Box>
              {loans.map((loan) => {
                return (
                  <Box key={loan.id} my={2} border="2px solid #F5F5F5">
                    <Card className={classes.card}>
                      <Grid container alignItems="center">
                        <Grid item xs={9}>
                          <h3>{loan.title}</h3>
                        </Grid>
                        {loan.showInvestedBadge && (
                          <Grid item xs={3}>
                            <Box component="span" color="green">
                              Invested
                            </Box>
                          </Grid>
                        )}
                        <Grid
                          item
                          xs={7}
                          sm={9}
                          md={9}
                          className={classes.grid}
                        >
                          <p>
                            <strong>Tranche:</strong> {loan.tranche}
                          </p>
                          <p>
                            <strong>Amount:</strong> £
                            {loan.amount.toLocaleString()}
                          </p>
                          <p>
                            <strong>Available:</strong> £
                            {loan.available.toLocaleString()}
                          </p>
                        </Grid>
                        <Grid item xs={5} sm={3} md={3}>
                          <ButtonBase
                            onClick={() => handleClickOpen(loan)}
                            className={classes.btnBase}
                            data-testid="invest"
                          >
                            <Box className={classes.button}>Invest</Box>
                          </ButtonBase>
                        </Grid>
                      </Grid>
                    </Card>
                  </Box>
                );
              })}
            </Box>
            <Box component="p" textAlign="center" p={0} m={0}>
              Total amount available for investments:
              <strong> £{totalAvailable.toLocaleString()}</strong>
            </Box>
          </Box>
        </Paper>

        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <Box width={{ md: "30vw" }} p={(2, 4)}>
            <Box component="h3" mb={0.5}>
              Invest in Loan
            </Box>
            <Box component="p" mt="0">
              {selectedLoan?.title}
            </Box>
            <Box>
              <p>
                <strong>Amount available:</strong> £
                {selectedLoan?.available.toLocaleString()}
              </p>
              <p>
                <strong>Loan ends in:</strong> {selectedLoan?.term_remaining}ms
              </p>
            </Box>
            <Grid container>
              <Grid item xs={12}>
                <p>Investment amount (£)</p>
              </Grid>
              <Grid item xs={6} md={8}>
                <TextField
                  variant="outlined"
                  label="Amount"
                  type="number"
                  size="small"
                  value={loanInput.toLocaleString()}
                  onChange={(e) => setLoanInput(e.target.value)}
                  fullWidth
                />
              </Grid>
              &nbsp;
              <Grid item xs={4} md={3}>
                <ButtonBase 
                onClick={investAmount}
                >
                  <Box className={classes.button}>invest</Box>
                </ButtonBase>
              </Grid>
              <Grid item xs={6} md={8}>
                {error && (
                  <Box color="red" fontSize="12px" mx="auto" component="span">
                    {error}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
}
