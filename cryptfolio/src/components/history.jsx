import React, { useState, useEffect } from "react";
import "../assets/css/Table.css";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table as BootstrapTable,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import { useGetCryptosQuery } from "../services/cryptoApi.js";

const PAGE_SIZE = 10;

function History() {
  const [investments, setInvestments] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const { data: cryptosList, isFetching } = useGetCryptosQuery(20);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchInvestmentData = async () => {
      try {
        const response = await fetch("http://localhost:3001/investement");
        if (response.ok) {
          const data = await response.json();
          setInvestments(data);
        } else {
          console.error("Failed to fetch investment data");
        }
      } catch (error) {
        console.error("Error fetching investment data:", error);
      }
    };

    fetchInvestmentData();
  }, []);

  const calculateGain = (investment, crypto) => {
    const currentPrice = crypto.price;
    const buyPrice = investment.price;
    const amount = investment.amount;
    const gain = (currentPrice - buyPrice) * amount;
    return gain.toFixed(2);
  };

  const handleStatusChange = async (investmentIndex, newStatus) => {
    const confirmation = window.confirm(
      `Are you sure you want to change the status to ${newStatus}?`,
      "Confirmation"
    );

    if (confirmation) {
      const updatedInvestments = [...investments];
      updatedInvestments[investmentIndex].status = newStatus;
      setInvestments(updatedInvestments);

      try {
        const investmentId = updatedInvestments[investmentIndex].id;
        const response = await fetch(`http://localhost:3001/investement`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error("Failed to update investment status");
        }

        console.log("Investment status updated successfully");
      } catch (error) {
        console.error("Error updating investment status:", error);
        // Handle error (e.g., show error message to the user)
      }
    }
  };

  const toggleDropdown = (index) => {
    setOpenDropdowns((prevOpenDropdowns) =>
      prevOpenDropdowns.includes(index)
        ? prevOpenDropdowns.filter((i) => i !== index)
        : [...prevOpenDropdowns, index]
    );
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="TableH">
              <CardHeader>
                <CardTitle tag="h4"> Operations History</CardTitle>
              </CardHeader>
              <CardBody>
                <BootstrapTable
                  className="table-dark"
                  responsive
                  striped
                  bordered
                  hover
                >
                  <thead className="text-primary">
                    <tr>
                      <th>Currency</th>
                      <th>Symbol</th>
                      <th className="text-center">Amount</th>
                      <th className="text-center">Buy price $</th>
                      <th className="text-center">Current price $</th>
                      <th className="text-center">Gain $</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments
                      .slice(startIndex, endIndex)
                      .map((investment, idx) => {
                        const crypto = cryptosList?.data?.coins.find(
                          (crypto) => crypto.name === investment.coin
                        );
                        const gain =
                          crypto && calculateGain(investment, crypto);
                        return (
                          <tr key={idx}>
                            <td>{investment.coin}</td>
                            <td>{crypto ? crypto.symbol : "-"}</td>
                            <td className="text-center">{investment.amount}</td>
                            <td className="text-center">{investment.price}</td>
                            <td className="text-center">
                              {crypto
                                ? parseFloat(crypto.price).toFixed(2)
                                : "-"}
                            </td>
                            <td className="text-center">
                              {gain !== undefined ? `${gain}` : "-"}
                            </td>
                            <td className="text-center">
                              <Dropdown
                                isOpen={openDropdowns.includes(idx)}
                                toggle={() => toggleDropdown(idx)}
                              >
                                <DropdownToggle
                                  caret
                                  color={
                                    investment.status === "Holding"
                                      ? "success"
                                      : "danger"
                                  }
                                >
                                  {investment.status}
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem
                                    onClick={() =>
                                      handleStatusChange(
                                        startIndex + idx,
                                        "Holding"
                                      )
                                    }
                                  >
                                    Holding
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() =>
                                      handleStatusChange(
                                        startIndex + idx,
                                        "Closed"
                                      )
                                    }
                                  >
                                    Closed
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </BootstrapTable>
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default History;
