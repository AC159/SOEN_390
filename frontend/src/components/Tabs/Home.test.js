import React from 'react';
import {render, screen} from '@testing-library/react';

import Home from './Home';

describe('visual test of Home Component', () => {
  it('should load and display withou error', () => {
    render(<Home />);

    expect(screen.getByText(/COVID cases going down/)).toBeInTheDocument();
    expect(screen.getByText(/General FAQs/)).toBeInTheDocument();
    expect(screen.getByText(/^Symptoms$/)).toBeInTheDocument();
    expect(screen.getByText(/^Useful$/)).toBeInTheDocument();
  });
});
