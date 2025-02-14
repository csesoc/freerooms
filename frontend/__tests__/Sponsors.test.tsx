import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";

import Sponsors from "../components/Sponsors";

describe("Sponsors", () => {
  it("renders heading text", () => {
    render(<Sponsors />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Our Sponsors",
    });

    expect(heading).toBeInTheDocument();
  });

  it("shows Arista logo", () => {
    render(<Sponsors />);

    const arista = screen.getByRole("img", { name: "Arista" });

    expect(arista).toBeInTheDocument();
  });

  it("shows Jane Street logo", () => {
    render(<Sponsors />);

    const janeStreet = screen.getByRole("img", { name: "Jane Street" });

    expect(janeStreet).toBeInTheDocument();
  });

  it("shows The Trade Desk logo", () => {
    render(<Sponsors />);

    const tradeDesk = screen.getByRole("img", { name: "The Trade Desk" });

    expect(tradeDesk).toBeInTheDocument();
  });

  it("shows SafetyCulture", () => {
    render(<Sponsors />);

    const safetyCulture = screen.getByRole("img", { name: "SafetyCulture" });

    expect(safetyCulture).toBeInTheDocument();
  });
});
