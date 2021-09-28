'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DelivryPriceSchema extends Schema {
  up () {
    this.create('delivry_prices', (table) => {
      table.increments()
      table.integer('district_id')
      table.integer('price').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('delivry_prices')
  }
}

module.exports = DelivryPriceSchema
