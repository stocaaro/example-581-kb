import { generateClient } from "aws-amplify/api";
import React, { useEffect, useState } from "react";
import { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

export default function App(): React.ReactElement {
  return (
    <main>
      <h1>Welcome to my app</h1>
    </main>
  );
}
