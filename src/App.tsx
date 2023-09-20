import React from "react";
import "./dark-mode.css";
import "./App.css";

import { WorkflowArgumentsForm } from "@freemarket/args-ui-react";
import { Workflow } from "@freemarket/client-sdk";
// import Fun from "./Fun";
import MetaMaskDemo from "./WorkflowMetamask";

const workflow: Workflow = {
  steps: [
    {
      type: "wrap-native",
      amount: "{{ startAmount }}",
      source: "caller",
    },
  ],
  parameters: [
    {
      name: "amount",
      label: "Amount",
      description: "The amount you want to wrap",
      type: "amount",
    },
  ],
};

export default function App() {
  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: 30,
          padding: 40,
        }}
      >
        <h1>Free Market Example</h1>
        {/* <Fun /> */}
        <MetaMaskDemo />
        <WorkflowArgumentsForm
          workflow={workflow}
          onSubmit={(args) => console.log("submit", args)}
        />
      </div>
    </div>
  );
}
