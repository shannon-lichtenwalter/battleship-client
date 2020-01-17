import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './Dashboard';
import { MemoryRouter } from 'react-router-dom';


describe('Dashboard component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MemoryRouter><Dashboard /></MemoryRouter>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
})