import { userEvent, within } from "@storybook/testing-library";
import { Combobox } from "./combobox";

export default {
  component: Combobox
};

export const Open = {
  args: {
    items: [
      'a', 'b', 'c'
    ]
  },
  async play({canvasElement}) {
    const { findByRole } = within(canvasElement);
    await userEvent.click(
      await findByRole('textbox')
    );
  }
}
