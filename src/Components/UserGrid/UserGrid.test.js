import React from 'react'
import ReactDOM from 'react-dom'
import UserGrid from './UserGrid'
import { shallow } from 'enzyme'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'

describe(`UserGrid Component`, () => {
    it(`Renders without errors`, () => {
        const div = document.createElement('div');
        ReactDOM.render(<UserGrid /> , div)
        ReactDOM.unmountComponentAtNode(div)
    });

    it(`Displays no ship tiles as selected by default`, () => {
        const wrapper = mount(<UserGrid />)
        expect(toJson(wrapper)).toMatchSnapshot()
    });

    it(`Selects only the cell selected (A1) for a ship tile on the first click`, () =>{
        const wrapper = mount(<UserGrid />)
        wrapper.find('Cell').at(12).simulate('click')
        expect(toJson(wrapper)).toMatchSnapshot()
    })

    it(`Selects only valid tiles as ship tiles, and not the tiles reserved for labels`, () =>{
        const wrapper = mount(<UserGrid />)
        wrapper.find('Cell').at(1).simulate('click')
        expect(toJson(wrapper)).toMatchSnapshot()
    })

    it(`Displays a message underneath UserGrid if ships need to be placed`, () => {
        const wrapper = shallow(<UserGrid />)
        expect(wrapper.text()).toMatch(/Please select cells/)
    })

    it(`Stores boat tiles of current ship in an array 'playerShips' held in component state`, () =>{
        const wrapper = mount(<UserGrid />)
        wrapper.find('Cell').at(12).simulate('click')
        wrapper.find('button').at(1).simulate('click')
        setTimeout(() =>{
          expect(wrapper.state().playerShips[0].spaces).toHaveLength(5)
        }, 500)
        
    })

    it('Does not allow ship tiles occupied by one boat, to be occupied by another', () =>{
      const wrapper = mount(<UserGrid />)
      wrapper.find('Cell').at(12).simulate('click')
      wrapper.find('button').at(1).simulate('click')
      wrapper.find('button').at(0).simulate('click')
      wrapper.find('Cell').at(22).simulate('click')
      wrapper.find('button').at(1).simulate('click')
      setTimeout(() =>{
          expect(wrapper.state().playerShips[1].spaces).toHaveLength(0)
      }, 500)
    })

    it(`Displays a message underneath UserGrid if all ships are done being placed`, () => {
      const wrapper = mount(<UserGrid />)
      wrapper.find('Cell').at(12).simulate('click')
      wrapper.find('button').at(1).simulate('click')
      wrapper.find('Cell').at(13).simulate('click')
      wrapper.find('button').at(1).simulate('click')
      wrapper.find('Cell').at(14).simulate('click')
      wrapper.find('button').at(1).simulate('click')
      wrapper.find('Cell').at(15).simulate('click')
      wrapper.find('button').at(1).simulate('click')
      wrapper.find('Cell').at(16).simulate('click')
      wrapper.find('button').at(1).simulate('click')
      setTimeout(() => {
          expect(wrapper.text()).toMatch(/Your Fleet is Ready for Battle.../)
      }, 500)
  })


})



