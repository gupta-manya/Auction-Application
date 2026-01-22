// src/pages/OwnerDashboard.jsx
import React, { useState, useEffect } from "react";
import { Container, Form, Button, Table, Modal } from "react-bootstrap";
import EC from "elliptic";

const ec = new EC.ec("secp256k1");

function OwnerDashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    image: "",
    description: "",
    basePrice: "",
  });
  const [liveItemIds, setLiveItemIds] = useState([]);
  const [selectedBids, setSelectedBids] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("auctionItems")) || [];
    setItems(storedItems);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addItem = () => {
    const newItem = { ...form, id: Date.now(), live: false };
    const prevItems = JSON.parse(localStorage.getItem("auctionItems")) || [];
    const updatedItems = [...prevItems, newItem];
    localStorage.setItem("auctionItems", JSON.stringify(updatedItems));
    setItems(updatedItems);
    setForm({ name: "", image: "", description: "", basePrice: "" });
  };

  const deleteItem = (id) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("auctionItems", JSON.stringify(updated));
  };

  const makeLive = (id) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, live: true } : item
    );
    setItems(updatedItems);
    setLiveItemIds([...liveItemIds, id]);
    localStorage.setItem("auctionItems", JSON.stringify(updatedItems));
  };

  const handleViewBids = (itemId) => {
    const allBids = JSON.parse(localStorage.getItem("sealedBids")) || [];
    const itemBids = allBids.filter((b) => b.itemId === itemId);

    // Simulate decryption with owner's private key (static demo)
    const privateKey = "1c3e5a7d8f6b2a4d9e0f5c7b6a3d4e9f1a2b3c4d5e6f7890abcdef1234567890"; // static
    const decrypted = itemBids.map((bid) => {
      try {
        const pubKey = ec.keyFromPublic(bid.publicKey, "hex");
        const shared = pubKey.getPublic().mul(privateKey);
        const encodedBid = atob(bid.encryptedBid);
        const decryptedBid = parseInt(encodedBid); // simulate
        return { ...bid, decryptedBid };
      } catch (err) {
        return { ...bid, decryptedBid: "Error" };
      }
    });

    setSelectedItem(itemId);
    setSelectedBids(decrypted);
    setShowModal(true);
  };

  const highestBid = selectedBids.reduce(
    (max, bid) => (bid.decryptedBid > max ? bid.decryptedBid : max),
    0
  );

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Owner Dashboard</h2>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Item Name</Form.Label>
          <Form.Control type="text" name="name" value={form.name} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control type="text" name="image" value={form.image} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={2} name="description" value={form.description} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Base Price</Form.Label>
          <Form.Control type="number" name="basePrice" value={form.basePrice} onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" onClick={addItem}>Add Item</Button>
      </Form>

      <hr />
      <h4 className="mb-3">Auction Items</h4>
      {items.length === 0 ? (
        <p>No items added yet.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Description</th>
              <th>Base Price</th>
              <th>Live Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td><img src={item.image} alt="item" width="100" /></td>
                <td>{item.description}</td>
                <td>₹{item.basePrice}</td>
                <td>{item.live ? "LIVE" : "—"}</td>
                <td>
                  <Button variant="success" className="me-2" onClick={() => makeLive(item.id)}>
                    Make Live
                  </Button>
                  <Button variant="info" className="me-2" onClick={() => handleViewBids(item.id)}>
                    View Bids
                  </Button>
                  <Button variant="danger" onClick={() => deleteItem(item.id)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Decrypted Bids for Item #{selectedItem}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBids.length === 0 ? (
            <p>No bids found for this item.</p>
          ) : (
            <Table bordered>
              <thead>
                <tr>
                  <th>User Public Key</th>
                  <th>Decrypted Bid</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedBids.map((bid, index) => (
                  <tr key={index}>
                    <td style={{ fontSize: "0.8em" }}>{bid.publicKey.slice(0, 40)}...</td>
                    <td>{bid.decryptedBid}</td>
                    <td>{bid.decryptedBid === highestBid ? "🏆 Highest" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default OwnerDashboard;