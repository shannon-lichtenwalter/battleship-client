import React from 'react';
import ReactDOM from 'react-dom';
import ActiveGameListItem from './ActiveGameListItem';
import { MemoryRouter } from 'react-router-dom';

describe('ActiveGameListItem component', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
    <MemoryRouter>
      <ActiveGameListItem 
      key={1} 
      game={{}} 
      userId={{}}
      setError= {{}}/>
      </MemoryRouter>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
})