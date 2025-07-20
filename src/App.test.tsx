import { render, waitForElementToBeRemoved } from "@testing-library/react";
import { test, expect } from "vitest";

import App from "./App";

test("renders a button", async () => {
  const { getByText } = render(<App />);
  await waitForElementToBeRemoved(getByText(/loading/i));
  const buttonElement = getByText(/add/i);
  expect(buttonElement).toBeInTheDocument();
});
