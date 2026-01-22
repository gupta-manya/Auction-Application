import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Row, Col, Card } from "react-bootstrap";

export default function Home() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("auctionItems")) || [];
    setAuctions(storedItems);
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">🕵‍♂ Live Sealed-Bid Auctions</h1>

      <Row className="mb-4">
        <Col className="text-center">
          <Button variant="primary" className="me-3" onClick={() => navigate("/login")}>
            Enter as User
          </Button>
          <Button variant="secondary" onClick={() => navigate("/login")}>
            Enter as Owner
          </Button>
        </Col>
      </Row>

      <Row>
        {auctions.length === 0 ? (
          <p className="text-center text-muted">No auction items yet. Owner needs to add them.</p>
        ) : (
          auctions.map((item) => (
            <Col key={item.id} xs={12} sm={6} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={item.image}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text>
                    <strong>Base Price: ₹{item.basePrice}</strong>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}