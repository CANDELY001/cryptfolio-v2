import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
import { Bar, Doughnut } from "react-chartjs-2";
import { useGetCryptosQuery } from "../services/cryptoApi.js";
function Dashboard(props) {
  const { data: cryptosList, isFetching } = useGetCryptosQuery(20);
  const [currentNetWorth, setCurrentNetWorth] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalGrowth, setTotalGrowth] = useState(0);
  const [roiCoins, setRoilCoins] = useState(0);
  const [netWorthData, setNetWorthData] = useState(null);
  useEffect(() => {
    // Function to calculate net worth for each of the last four weeks
    const calculateNetWorth = () => {
      if (investments.length > 0) {
        const currentDate = new Date();
        const weeklyNetWorth = {
          labels: [],
          data: [],
        };

        // Calculate net worth for each of the last four weeks
        for (let i = 3; i >= 0; i--) {
          const weekStartDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - i * 7
          );
          const weekEndDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - (i - 1) * 7
          );

          const netWorthForWeek = investments.reduce((total, investment) => {
            const investmentDate = new Date(investment.dateInvestment);
            if (
              investmentDate >= weekStartDate &&
              investmentDate < weekEndDate
            ) {
              const crypto = cryptosList.data.coins.find(
                (coin) => coin.name === investment.coin
              );
              if (crypto) {
                return total + investment.amount * crypto.price;
              }
            }
            return total;
          }, 0);

          weeklyNetWorth.labels.push(`Week ${i + 1}`);
          weeklyNetWorth.data.push(netWorthForWeek);
        }

        // Set the net worth data in state
        setNetWorthData(weeklyNetWorth);
      }
    };

    calculateNetWorth();
  }, [investments, cryptosList]);

  // Prepare data for the doughnut chart
  const prepareDoughnutChartData = () => {
    if (cryptosList && cryptosList.data && investments.length > 0) {
      const coinTotals = {};

      // Process investment data to calculate total amount for each coin
      investments.forEach((investment) => {
        const crypto = cryptosList.data.coins.find(
          (coin) => coin.name === investment.coin
        );
        if (crypto) {
          if (!coinTotals[crypto.name]) {
            coinTotals[crypto.name] = 0;
          }
          coinTotals[crypto.name] += investment.amount;
        }
      });

      // Prepare data for the doughnut chart
      const labels = [];
      const data = [];
      const backgroundColors = [];

      // Populate labels, data, and backgroundColors arrays
      Object.entries(coinTotals).forEach(([coinName, totalAmount]) => {
        labels.push(coinName);
        data.push(totalAmount);
        backgroundColors.push(getRandomColor());
      });

      // Return the chart data object
      return {
        labels: labels,
        datasets: [
          {
            label: "Coins",
            data: data,
            backgroundColor: backgroundColors,
            borderColor: "rgba(255, 255, 255, 0)",
            hoverOffset: 4,
          },
        ],
        options: {
          maintainAspectRatio: true,
          responsive: true,
          cutoutPercentage: 10,
        },
      };
    }

    // Return null if there is no data available
    return null;
  };

  // Function to generate random colors
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  useEffect(() => {
    // Fetch data from the database (investments)
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
    fetchInvestments();
  }, []);
  useEffect(() => {
    // Calculate current net worth
    if (cryptosList && cryptosList.data && investments.length > 0) {
      const totalGrowth = cryptosList.data.coins.reduce((total, crypto) => {
        const investment = investments.find(
          (investment) => investment.coin === crypto.name
        );
        return total + crypto.price * (investment ? investment.amount : 0);
      }, 0);

      setTotalGrowth(totalGrowth);
    }
  }, [cryptosList, investments]);
  useEffect(() => {
    // Calculate current net worth for closed investments
    if (cryptosList && cryptosList.data && investments.length > 0) {
      const roiCoins = cryptosList.data.coins.reduce((total, crypto) => {
        const investment = investments.find(
          (investment) =>
            investment.coin === crypto.name && investment.status === "Closed"
        );
        if (investment) {
          return total + (crypto.price - investment.price) * investment.amount;
        } else {
          return total;
        }
      }, 0);

      setRoilCoins(roiCoins);
    }
  }, [cryptosList, investments]);

  useEffect(() => {
    if (investments) {
      // Calculate total number of coins
      const totalCoinsCount = investments.reduce((total, investment) => {
        return total + investment.amount;
      }, 0);
      setTotalCoins(totalCoinsCount);
    }
  }, [investments]);
  useEffect(() => {
    // Calculate total growth
    if (cryptosList && cryptosList.data && investments.length > 0) {
      const currentNetWorth = investments.reduce((total, investment) => {
        // Find the corresponding cryptocurrency data
        const crypto = cryptosList.data.coins.find(
          (coin) => coin.name === investment.coin
        );

        // Calculate the growth for this investment
        const growth = (crypto.price - investment.price) * investment.amount;

        // Add the growth to the total
        return total + growth;
      }, 0);

      // Set the total growth in state
      setCurrentNetWorth(currentNetWorth);
    }
  }, [cryptosList, investments]);

  return (
    <>
      <div className="content">
        <Row>
          <Col xs="12">
            <div className="Cards-info-4">
              <Row>
                <Col lg="3" sm="6">
                  <div className="grid-margin stretch-card">
                    <Card
                      style={{
                        backgroundColor: " #18283b",
                        color: "white",
                        borderRadius: "15px",
                        boxShadow: "0px 4px 12px rgba(131, 146, 165, 0.2)",
                      }}
                    >
                      <CardBody>
                        <div className="row">
                          <div className="col-9">
                            <div className="d-flex align-items-center align-self-start">
                              <h3 className="mb-0">
                                {/* Calculate net worth */}$
                                {currentNetWorth.toFixed(2)}
                              </h3>
                              <p className="text-success ml-2 mb-0 font-weight-medium">
                                +68%
                              </p>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="icon icon-box-success">
                              <span className="mdi mdi-arrow-top-right icon-item"></span>
                            </div>
                          </div>
                        </div>
                        <h6
                          className="font-weight-normal"
                          style={{
                            color: "grey",
                            fontSize: "15px",
                            fontWeight: "400",
                          }}
                        >
                          Net Worth
                        </h6>
                      </CardBody>
                    </Card>
                  </div>
                </Col>
                <Col lg="3" sm="6">
                  <div className="grid-margin stretch-card">
                    <Card
                      style={{
                        backgroundColor: " #18283b",
                        color: "white",
                        borderRadius: "15px",
                        boxShadow: "0px 4px 12px rgba(131, 146, 165, 0.2)",
                      }}
                    >
                      <CardBody>
                        <div className="row">
                          <div className="col-9">
                            <div className="d-flex align-items-center align-self-start">
                              <h3 className="mb-0">
                                {/* Display total coins */}
                                {totalCoins.toFixed(0)}
                              </h3>
                              {/* Assuming total coins change is also available */}
                              <p
                                className={`text-success ml-2 mb-0 font-weight-medium`}
                              >
                                {/* Placeholder value for total coins change */}
                                +33.5%
                              </p>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="icon icon-box-success">
                              <span className="mdi mdi-arrow-top-right icon-item"></span>
                            </div>
                          </div>
                        </div>
                        <h6
                          className=" font-weight-normal"
                          style={{
                            color: "grey",
                            fontSize: "15px",
                            fontWeight: "400",
                          }}
                        >
                          Total coins
                        </h6>
                      </CardBody>
                    </Card>
                  </div>
                </Col>
                <Col lg="3" sm="6">
                  <div className="grid-margin stretch-card">
                    <Card
                      style={{
                        backgroundColor: " #18283b",
                        color: "white",
                        borderRadius: "15px",
                        boxShadow: "0px 4px 12px rgba(131, 146, 165, 0.2)",
                      }}
                    >
                      <CardBody>
                        <div className="row">
                          <div className="col-9">
                            <div className="d-flex align-items-center align-self-start">
                              <h3 className="mb-0">
                                {/* Display total growth */}$
                                {totalGrowth.toFixed(2)}{" "}
                                {/* Assuming totalGrowth is a number */}
                              </h3>
                              {/* Placeholder for total growth change */}
                              <p
                                className={`text-success ml-2 mb-0 font-weight-medium`}
                              >
                                +93.5%
                              </p>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="icon icon-box-success">
                              <span className="mdi mdi-arrow-top-right icon-item"></span>
                            </div>
                          </div>
                        </div>
                        <h6
                          className="font-weight-normal"
                          style={{
                            color: "grey",
                            fontSize: "15px",
                            fontWeight: "400",
                          }}
                        >
                          Total growth
                        </h6>
                      </CardBody>
                    </Card>
                  </div>
                </Col>
                <Col lg="3" sm="6">
                  <div className="grid-margin stretch-card">
                    <Card
                      style={{
                        backgroundColor: " #18283b",
                        color: "white",
                        borderRadius: "15px",
                        boxShadow: "0px 4px 12px rgba(131, 146, 165, 0.2)",
                      }}
                    >
                      <CardBody>
                        <div className="row">
                          <div className="col-9">
                            <div className="d-flex align-items-center align-self-start">
                              <h3 className="mb-0">{roiCoins.toFixed(2)} </h3>
                              <p className="text-success ml-2 mb-0 font-weight-medium">
                                +3.5%
                              </p>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="icon icon-box-success">
                              <span className="mdi mdi-arrow-top-right icon-item"></span>
                            </div>
                          </div>
                        </div>
                        <h6
                          className=" font-weight-normal"
                          style={{
                            color: "grey",
                            fontSize: "15px",
                            fontWeight: "400",
                          }}
                        >
                          ROI
                        </h6>
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg="8">
            <Card
              className="card-chart"
              style={{
                backgroundColor: " #18283b",
                color: "white",
                borderRadius: "15px",
                boxShadow: "0px 4px 12px rgba(131, 146, 165, 0.2)",
                marginTop: "10px",
              }}
            >
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <CardTitle tag="h5" style={{ color: "rgb(49, 225, 245)" }}>
                      Performance
                    </CardTitle>
                  </Col>
                  <Col sm="6"></Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  {netWorthData && (
                    <Bar
                      data={{
                        labels: netWorthData.labels,
                        datasets: [
                          {
                            label: "Net Worth Over Last 4 Weeks",
                            data: netWorthData.data,
                            backgroundColor: "rgba(49, 225, 245, 0.441)",
                            borderColor: "rgb(49, 225, 245)",
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card
              className="card-chart"
              style={{
                backgroundColor: " #18283b",
                color: "white",
                borderRadius: "15px",
                boxShadow: "0px 4px 12px rgba(131, 146, 165, 0.2)",
                marginTop: "10px",
                height: "420px",
                justifyContent: "center",
              }}
            >
              <CardBody>
                <div className="chart-area">
                  {cryptosList && investments.length > 0 && (
                    <Doughnut data={prepareDoughnutChartData()} />
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card
              style={{
                backgroundColor: " #18283b",
                color: "#4770a6",
                marginTop: "10px",
                borderRadius: "15px",
              }}
            >
              <CardHeader>
                <CardTitle tag="h4" style={{ color: "rgb(49, 225, 245)" }}>
                  Long Term Crypto
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Table
                  className="tablesorter"
                  responsive
                  style={{
                    overflowY: "scroll",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#666 #333",
                  }}
                >
                  <thead className="text-primary">
                    <tr>
                      <th>Symbol</th>
                      <th>Name</th>
                      <th className="text-center">Price</th>
                      <th className="text-center">Change %</th>
                      <th className="text-center">Change $</th>
                      <th className="text-center">Gain $</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Filter cryptosList to display only the long-term coins user invested in */}
                    {cryptosList?.data?.coins
                      .filter((crypto) =>
                        investments.some(
                          (investment) => investment.coin === crypto.name
                        )
                      )
                      .map((crypto) => {
                        // Find the investment corresponding to the current crypto
                        const investment = investments.find(
                          (investment) => investment.coin === crypto.name
                        );
                        return (
                          <tr key={crypto.id}>
                            <td>{crypto.symbol}</td>
                            <td>{crypto.name}</td>
                            <td className="text-center">
                              {parseFloat(crypto.price).toFixed(2)}
                            </td>
                            <td className="text-center">{crypto.change}%</td>
                            {/* Calculate change and gain based on fetched data */}
                            <td className="text-center">
                              {parseFloat(crypto.change * crypto.price).toFixed(
                                2
                              )}
                            </td>
                            {/* Check if investment is defined before calculating gain */}
                            <td className="text-center">
                              {parseFloat(
                                investment &&
                                  (crypto.price - investment.price) *
                                    investment.amount
                              ).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
