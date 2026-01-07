import { Redirect } from "expo-router";
import React from "react";

function Pending() {
  return <Redirect href="/connections/pending/inbound" />;
}

export default Pending;
