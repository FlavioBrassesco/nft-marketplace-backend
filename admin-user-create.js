const { ethers } = require("ethers");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

async function createUser() {
  const message = new Date().toISOString();
  const signer = new ethers.Wallet(process.env.ADMIN_KEY);

  const signedMessage = await signer.signMessage(message);
  console.log("address", signer.address);
  fetch("http://localhost:8000/api/user", {
    method: "POST",
    body: JSON.stringify({
      message: message,
      signature: signedMessage,
      address: signer.address,
    }),
    headers: { "Content-type": "application/json" },
  })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((error) => console.error(error));
}

async function getToken() {
  const message = new Date().toISOString();
  const signer = new ethers.Wallet(process.env.USER2_KEY);
  const signedMessage = await signer.signMessage(message);

  fetch("http://localhost:8000/auth/signin", {
    method: "POST",
    body: JSON.stringify({
      address: signer.address,
      message: message,
      signature: signedMessage,
    }),
    headers: { "Content-type": "application/json" },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}

// createUser();
getToken();
