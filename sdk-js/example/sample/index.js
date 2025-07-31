import { Opal } from "@getopal/sdk";

const client = new Opal({
  apiKey: "sk_42634a5cbf0840d393d52e8f81528810",
  apiUrl: "http://localhost:8080/api",
});

client.authenticate("nikhil.nixel@gmail.com", "Admin@123", "email-password").then((session) => {
  console.log("Authenticated:", session);
  console.log(client.user)
});