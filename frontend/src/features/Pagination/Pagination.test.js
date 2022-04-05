import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Pagination from './Pagination';

window.scrollTo = jest.fn();

describe('visual test of Paginatio component', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should load and display without error empty list', () => {
    render(<Pagination emptyMessage='No data' data={[]} render={() => {}} />);

    expect(screen.getByText(/No data/)).toBeInTheDocument();
    expect(screen.queryByTestId('pagination-control')).toBeNull();
  });

  it('should render a list of item without error', () => {
    render(
      <Pagination
        data={[
          {user: 'John', age: 123},
          {user: 'Peter', age: 1},
        ]}
        render={({user, age}) => (
          <p key={user}>
            {user} - {age}
          </p>
        )}
      />,
    );

    expect(screen.getByText(/John/)).toBeInTheDocument();
    expect(screen.getByText(/Peter/)).toBeInTheDocument();
  });

  it('should be able to change page', async () => {
    render(
      <Pagination
        itemPerPage={1}
        data={[
          {user: 'John', age: 123},
          {user: 'Peter', age: 1},
        ]}
        render={({user, age}) => (
          <p key={user}>
            {user} - {age}
          </p>
        )}
      />,
    );

    userEvent.click(screen.getByText(/^2$/));

    expect(await screen.findByText(/Peter/)).toBeInTheDocument();
    expect(screen.queryByText(/John/)).toBeNull();
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
  });

  it('should be able to change page then return to original page', async () => {
    render(
      <Pagination
        itemPerPage={1}
        data={[
          {user: 'John', age: 123},
          {user: 'Peter', age: 1},
        ]}
        render={({user, age}) => (
          <p key={user}>
            {user} - {age}
          </p>
        )}
      />,
    );

    userEvent.click(screen.getByText(/^2$/));
    expect(await screen.findByText(/Peter/)).toBeInTheDocument();
    expect(screen.queryByText(/John/)).toBeNull();

    userEvent.click(screen.getByText(/^1$/));
    expect(await screen.findByText(/John/)).toBeInTheDocument();
    expect(screen.queryByText(/Peter/)).toBeNull();

    expect(window.scrollTo).toHaveBeenCalledTimes(3);
  });
});
