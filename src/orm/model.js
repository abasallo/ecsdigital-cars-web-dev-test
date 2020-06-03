import Sequelize from 'sequelize'

const Car = (sequelize) =>
  sequelize.define('car', {
    id: { type: Sequelize.STRING, primaryKey: true },
    make: { type: Sequelize.STRING },
    model: { type: Sequelize.STRING },
    modelParagraph: { type: Sequelize.STRING },
    colour: { type: Sequelize.STRING },
    year: { type: Sequelize.STRING },
  })

export const initializeModel = (sequelize) => ({ Car: Car(sequelize) })
