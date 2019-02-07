import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ApolloClient from "apollo-boost";

import { ApolloProvider } from "react-apollo";
import OneGraphAuth from "onegraph-auth";

const APP_ID = "4b1a8654-2b1f-46ef-bb5e-a3424c2a7003";

const auth = new OneGraphAuth({
  appId: APP_ID
});

const client = new ApolloClient({
  uri: "https://serve.onegraph.com/dynamic?app_id=" + APP_ID,
  request: operation => operation.setContext({ headers: auth.authHeaders() })
});

auth.isLoggedIn("spotify").then(isLoggedIn => {
  if (isLoggedIn) {
    console.log("Already logged in to GitHub");
  } else {
    console.log("Not logged in to GitHub.");
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
