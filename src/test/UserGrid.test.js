import React from 'react'
import ReactDOM from 'react-dom'
import UserGrid from '../Components/UserGrid/UserGrid'
import { shallow } from 'enzyme'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'

describe.only(`UserGrid Component`, () => {
    it(`Renders without errors`, () => {
        const div = document.createElement('div');
        ReactDOM.render(<UserGrid /> , div)
        ReactDOM.unmountComponentAtNode(div)
    });

    it(`Displays no ship tiles as selected by default`, () => {
        const wrapper = shallow(<UserGrid />)
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

    it(`Allows ship tiles to be un-selected in the current boat if the tile is clicked consecutively`, () => {
      const wrapper = mount(<UserGrid />)
      wrapper.find('Cell').at(12).simulate('click')
      wrapper.find('Cell').at(12).simulate('click')
      expect(wrapper.state().boat).toHaveLength(0)
    })

    it(`Stores boat tiles of current ship in an array 'boat' held in component state`, () =>{
        const wrapper = mount(<UserGrid />)
        wrapper.find('Cell').at(12).simulate('click')
        wrapper.find('Cell').at(13).simulate('click')
        wrapper.find('Cell').at(14).simulate('click')
        wrapper.find('Cell').at(15).simulate('click')
        expect(wrapper.state().boat).toHaveLength(4)
    })

    it(`Does not allow boats which lack coherence (missing ship tiles) as valid boat objects`, () =>{
      const wrapper = mount(<UserGrid />)
      wrapper.find('Cell').at(12).simulate('click')
      wrapper.find('Cell').at(13).simulate('click')
      wrapper.find('Cell').at(14).simulate('click')
      wrapper.find('Cell').at(15).simulate('click')
      wrapper.find('Cell').at(16).simulate('click')
          // The following creates an invalid arrangement of the 4 celled Battleship
      wrapper.find('Cell').at(19).simulate('click')
      wrapper.find('Cell').at(20).simulate('click')
      wrapper.find('Cell').at(21).simulate('click')
      wrapper.find('Cell').at(17).simulate('click')
      expect(wrapper.state().boat).toHaveLength(0)
    })

    it('Does not allow boats arranged horizontally to have vertical tiles placed', () =>{
      const wrapper = mount(<UserGrid />)
      wrapper.find('Cell').at(12).simulate('click')
      wrapper.find('Cell').at(23).simulate('click')
      wrapper.find('Cell').at(13).simulate('click')
      expect(wrapper.state().currentShipAlignment).toBe('horizontal')
    })

    it('Does not allow ship tiles occupied by one boat, to be occupied by another', () =>{
      const wrapper = mount(<UserGrid />)
      wrapper.find('Cell').at(12).simulate('click')
      wrapper.find('Cell').at(13).simulate('click')
      wrapper.find('Cell').at(14).simulate('click')
      wrapper.find('Cell').at(15).simulate('click')
      wrapper.find('Cell').at(16).simulate('click')
      wrapper.find('Cell').at(14).simulate('click')
      expect(wrapper.state().boat).toHaveLength(0)
    })

    it('Does not allow boats arranged vertically to have horizontal tiles placed', () => {
      const wrapper = mount(<UserGrid />)
      wrapper.find('Cell').at(12).simulate('click')
      wrapper.find('Cell').at(22).simulate('click')
      wrapper.find('Cell').at(13).simulate('click')
      expect(wrapper.state().currentShipAlignment).toBe('vertical')
    })

    it(`Stores each boat in an array of objects 'playerShips', with each ship cell held in key labeled 'spaces'`, () =>{
      const wrapper = mount(<UserGrid />)
      wrapper.find('Cell').at(12).simulate('click')
      wrapper.find('Cell').at(13).simulate('click')
      wrapper.find('Cell').at(14).simulate('click')
      wrapper.find('Cell').at(15).simulate('click')
      wrapper.find('Cell').at(16).simulate('click')
      expect(wrapper.state().playerShips[0].spaces).toHaveLength(5)
  })

    it(`Displays a message underneath UserGrid if all ships are done being placed`, () => {
      const wrapper = mount(<UserGrid />)
      wrapper.find('Cell').at(12).simulate('click')
      wrapper.find('Cell').at(13).simulate('click')
      wrapper.find('Cell').at(14).simulate('click')
      wrapper.find('Cell').at(15).simulate('click')
      wrapper.find('Cell').at(16).simulate('click')
      wrapper.find('Cell').at(17).simulate('click')
      wrapper.find('Cell').at(18).simulate('click')
      wrapper.find('Cell').at(19).simulate('click')
      wrapper.find('Cell').at(20).simulate('click')
      wrapper.find('Cell').at(22).simulate('click')
      wrapper.find('Cell').at(23).simulate('click')
      wrapper.find('Cell').at(24).simulate('click')
      wrapper.find('Cell').at(25).simulate('click')
      wrapper.find('Cell').at(26).simulate('click')
      wrapper.find('Cell').at(27).simulate('click')
      wrapper.find('Cell').at(28).simulate('click')
      wrapper.find('Cell').at(29).simulate('click')
      setTimeout(() => {
          expect(wrapper.text()).toMatch(/All Ships Have Been Set/)
      }, 1000)
  })


})



