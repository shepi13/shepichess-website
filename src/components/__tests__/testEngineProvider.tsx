import { getByRole, getByTestId } from "@testing-library/react";
import { act, useContext } from "react";

import { container, root } from "@/lib/test/componentTestHelpers";

import { ActiveEngineContext, EngineProvider } from "../EngineProvider";

const TestConsumer = ({ id }: { id: string }) => {
  const activeEngine = useContext(ActiveEngineContext);
  if (!activeEngine) {
    throw new Error("Context undefined!");
  }

  return (
    <div>
      <div data-testid="active-id">{activeEngine.engineId}</div>
      <button onClick={() => activeEngine.setEngineId(id)}>
        Set Engine Id
      </button>
    </div>
  );
};

describe("Test Engine Context Provider", () => {
  test("Set/Read Context", () => {
    act(() =>
      root.render(
        <EngineProvider>
          <TestConsumer id="test" />
        </EngineProvider>,
      ),
    );
    const activeIdDiv = getByTestId(container, "active-id");
    expect(activeIdDiv).toBeInTheDocument();
    expect(activeIdDiv.innerHTML).toBe("");

    const button = getByRole(container, "button", { name: "Set Engine Id" });
    act(() => button.click());
    expect(activeIdDiv.innerHTML).toBe("test");
  });
});
