import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [pincode, setPincode] = useState("");
  const [filter, setFilter] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [key, setKey] = useState(false);
  const [error, setError] = useState(""); // ✅ Error state

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setUserInfo([]); // Reset previous data

    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      if (response.data[0].Status === "Success") {
        setUserInfo(response.data[0].PostOffice);
        setKey(true);
      } else {
        setError("Invalid Pincode or No Data Found");
        setKey(false);
      }
    } catch (err) {
      setError("Something went wrong! Please try again.");
    }
  };

  // ✅ Case-insensitive filtering
  const filteredResults = userInfo.filter((item) =>
    item.Name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container">
      {!key && (
        <>
          <h2>Enter Pincode</h2>
          <form className="formCard" onSubmit={handleFormSubmit}>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter Pincode"
              required
            />
            <button type="submit">Lookup</button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </>
      )}

      {key && userInfo.length > 0 && (
        <div className="box-data">
          <div className="box-data-con">
            <div className="box-detail">
            <h2>Pincode: {pincode}</h2>
            <h2>
              Message: <span className="msg">Number of Post Offices Found: {filteredResults.length}</span>
            </h2>
            </div>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder=" 🔍 Filter by Name"
            />
          </div>
          <div className="card-container">
            {filteredResults.length > 0 ? (
              filteredResults.map((item, index) => (
                <div className="userDetailCard" key={index}>
                  <p>
                    <strong>Name:</strong> {item.Name}
                  </p>
                  <p>
                    <strong>Branch Type:</strong> {item.BranchType}
                  </p>
                  <p>
                    <strong>Delivery Status:</strong> {item.DeliveryStatus}
                  </p>
                  <p>
                    <strong>District:</strong> {item.District}
                  </p>
                  <p>
                    <strong>Division:</strong> {item.Division}
                  </p>
                </div>
              ))
            ) : (
              <p>No matching post offices found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App; 
