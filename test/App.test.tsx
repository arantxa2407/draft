import { render } from "@testing-library/react-native";
import React from "react";
import App from "../src/app/index";

describe("<App />", () => {
  it("se renderiza correctamente", () => {
    const { getByText } = render(<App />);
    expect(getByText("Smart Fridge & Grocery Management")).toBeTruthy();
  });
});
