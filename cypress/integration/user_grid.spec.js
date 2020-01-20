/// <reference types="Cypress" />

/**
 * @abstract: Visit UserGrid
 *
 * @criteria
  As a player
  - I'm directed to the User Grid where I can place my ships

*/

describe('The UserGHrid', function() {
    it('Successfully loads server', function() {
      cy.visit('http://localhost:8000/') 
    })
  })