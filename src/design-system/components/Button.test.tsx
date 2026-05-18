import { render, screen } from "@testing-library/react";

import { Button } from "./Button";

describe("Button", () => {
  it("renders button text", () => {
    render(<Button>Open chart</Button>);
    expect(screen.getByRole("button", { name: "Open chart" })).toBeInTheDocument();
  });
});
