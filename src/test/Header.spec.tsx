import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../components/Header';

describe('Header', () => {
  it('Renders successfully', () => {
    render(<Router><Header /></Router>);
  });
  it('displays active', () => {
    const { getByText } = render(<Router><Header /></Router>);
    getByText(/Active/);
  });
  it('displays finished', () => {
    const { getByText } = render(<Router><Header /></Router>);
    getByText(/Finished/);
  });
});
