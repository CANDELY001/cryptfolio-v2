import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
} from "reactstrap";
import "../assets/css/Investement.css";
import { useGetCryptosQuery } from "../services/cryptoApi.js";
import Select from "react-select";
const PAGE_SIZE = 3;
const Investement = () => {
  const [coin, setCoin] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const { data: cryptosList, isFetching } = useGetCryptosQuery(20);
  const [investments, setInvestments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const handleCoinChange = (selectedOption) => {
    if (selectedOption) {
      setCoin(selectedOption.label);
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleInvestment = async () => {
    try {
      const response = await fetch("http://localhost:3001/investement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coin,
          amount: parseFloat(amount),
          price: parseFloat(price),
        }),
      });

      if (response.ok) {
        console.log("Investment added successfully");
        // After adding investment, fetch and update investment data
      } else {
        console.error("Failed to add investment");
      }
    } catch (error) {
      console.error("Error adding investment:", error.message);
    }
  };
  const fetchInvestments = async () => {
    try {
      const response = await fetch("http://localhost:3001/investement");
      if (response.ok) {
        const data = await response.json();
        setInvestments(data);
      } else {
        console.error("Failed to fetch investments");
      }
    } catch (error) {
      console.error("Error fetching investments:", error.message);
    }
  };
  useEffect(() => {
    fetchInvestments();
  }, []);
  const filterTodayInvestments = (investments) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    return investments.filter(
      (investment) => investment.dateInvestment.split("T")[0] === today
    );
  };

  const todayInvestments = filterTodayInvestments(investments);
  const resetInputFields = () => {
    setCoin("");
    setAmount("");
    setPrice("");
  };
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  return (
    <div className="content">
      <Row>
        <Col xs="8" style={{ display: "block", margin: "auto" }}>
          <Card className="CardI">
            <CardHeader>
              <CardTitle tag="h4" style={{ color: "#4770a6" }}>
                Investment
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Form>
                <FormGroup>
                  <Label for="coin">Select currency</Label>
                  <Select
                    value={crypto.name}
                    onChange={handleCoinChange}
                    options={cryptosList?.data?.coins.map((crypto) => ({
                      value: crypto.uuid,
                      label: crypto.name,
                    }))}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="amount">Amount</Label>
                  <Input
                    type="text"
                    name="amount"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="price">Price</Label>
                  <Input
                    type="text"
                    name="price"
                    id="price"
                    value={price}
                    onChange={handlePriceChange}
                  />
                </FormGroup>
                <Button
                  color="primary"
                  onClick={async () => {
                    await handleInvestment();
                    await fetchInvestments();
                    const updatedInvestments =
                      filterTodayInvestments(investments);
                    resetInputFields();
                    setTodayInvestments(updatedInvestments); // Update today's investments in state
                  }}
                  style={{ display: "block", margin: "auto" }}
                >
                  Invest
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <Card style={{ backgroundColor: "#18283b" }}>
            <CardHeader>
              <CardTitle tag="h4" style={{ color: "#4770a6" }}>
                Today's Investments
              </CardTitle>
              <div style={{ color: "grey", textAlign: "right" }}>
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span style={{ margin: "0 10px" }}>{currentPage}</span>
                <Button
                  disabled={endIndex >= investments.length}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Currency</th>
                    <th>Amount</th>
                    <th>Buy Price</th>
                    <th>Change %</th>
                    <th>Gain $</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {todayInvestments
                    .slice(startIndex, endIndex)
                    .map((investment, index) => (
                      <tr key={index}>
                        <td>{investment.coin}</td>
                        <td>{investment.amount}</td>
                        <td>{investment.price}</td>
                        <td>000</td>
                        <td>000</td>
                        <td>{investment.status}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Investement;
