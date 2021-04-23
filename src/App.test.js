import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import App from './App';

afterEach(cleanup);
test('should take a snapshot', () => {
    const { asFragment } = render(<App />)
    expect(asFragment(<App />)).toMatchSnapshot()
})

test('should render text when app loads', () => {
  const { getByText } = render(<App />);
  const linkElement = screen.getByText(/investly/i);
  expect(linkElement).toBeInTheDocument();
  expect(getByText("Current Loans")).toBeInTheDocument();
});

test("button should be enabled when app loads", () => {
  const { getAllByTestId } = render(<App />);
  expect(getAllByTestId("invest")[0]).not.toHaveAttribute("disabled");
});

test("does not expect to haved called onClick prop when app loads", () => {
  const handleClick = jest.fn();
  render(<App/>);
  fireEvent.click(screen.getAllByText(/invest/i)[0]);
  expect(handleClick).toHaveBeenCalledTimes(0);
});