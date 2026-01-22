import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import EC from "elliptic";
const ec = new EC.ec("secp256k1");

export default function UserDashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [bids, setBids] = useState({});

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("auctionItems")) || [];
    const liveItems = storedItems.filter((item) => item.live);
    setItems(liveItems);
  }, []);

  const handleBidChange = (itemId, value) => {
    setBids((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleBidSubmit = (itemId) => {
    const bidAmount = bids[itemId];

    if (!bidAmount) return alert("Please enter a bid amount");

    // 1. Generate key pair
    const key = ec.genKeyPair();
    const publicKey = key.getPublic("hex");
    const privateKey = key.getPrivate("hex");

    // 2. Encrypt bid
    const encryptedBid = btoa(bidAmount); // TEMP encryption using base64

    // 3. Save to localStorage (simulate sealed bid)
    const userBids = JSON.parse(localStorage.getItem("sealedBids")) || [];
    userBids.push({
      itemId,
      encryptedBid,
      publicKey, // Used later to verify/decrypt
    });
    localStorage.setItem("sealedBids", JSON.stringify(userBids));

    alert("✅ Encrypted Bid Submitted!");
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">🚀 Live Auctions</h2>
      <Row>
        {items.map((item) => (
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
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Enter your bid"
                  onChange={(e) => handleBidChange(item.id, e.target.value)}
                />
                <button
                  className="btn btn-primary w-100"
                  onClick={() => handleBidSubmit(item.id)}
                >
                  Submit Sealed Bid
                </button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}