import React from 'react';
import ReactDOM from 'react-dom';
import Cell from './Cell';
import { shallow } from 'enzyme'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'

describe('Cell component', () => {

  it(`Renders without crashing`, () => {
    const div = document.createElement('div');
    ReactDOM.render(<Cell />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it.skip(`Displays a cell tile when rendered`, () => {
    const wrapper = shallow(<Cell />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })


  it(`Changes class to 'hit' if targeted and fired upon by opposing player while being a current ship tile`, () => {
    const hits = ['A1', 'B1']
    const id = 'A1'
    const wrapper = mount(<Cell hits={hits} id={id}/>)
    expect(wrapper.find('Cell').hasClass('hit'))
  })

  it(`Changes class to 'miss' if targeted and fired upon by opposing player while not a ship tile`, () => {
    const hits = ['A1', 'B1']
    const id = 'C1'
    const wrapper = mount(<Cell hits={hits} id={id}/>)
    expect(wrapper.find('Cell').hasClass('miss'))
  })

  it(`Changes class to 'selected' if selected by the player`, () => {
    const selected = 'A1'
    const id = 'A1'
    const wrapper = mount(<Cell selected={selected} id={id}/>)
    expect(wrapper.find('Cell').hasClass('selected'))
  })

  it(`Changes class to 'ship' if the id of the current cell is contained in the 'shipTileValues'
      array located in state of UserGrid Component`, () => {
        const shipTileValues = ['A1', 'A2', 'A3', 'A4']
        const id = 'A1'
        const wrapper = mount(<Cell shipTileValue={shipTileValues} id={id}/>)
        expect(wrapper.find('Cell').hasClass('ship'))
   })

   it(`Changes class to 'shot' if current cell id is located in the 'opponentShots' array located
      in the state of the UserGrid Component (inherently a ship cell)`, () => {
        const opponentShots = ['A1', 'A2', 'A3', 'A4']
        const id = 'A1'
        const wrapper = mount(<Cell opponentShots={opponentShots} id={id}/>)
        expect(wrapper.find('Cell').hasClass('shot'))
      })


  it.skip(`Cannot be clicked if currently a label` , () => {
    const label = true
    const id = 'A'
    const wrapper = mount(<Cell label={label} id={id}/>)
    wrapper.find('Cell').simulate('click')
    expect(toJson(wrapper)).toMatchSnapshot()
  })

})