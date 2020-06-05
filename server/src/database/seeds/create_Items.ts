//To execute a seed, run:
//npx knex --knexfile knexfile.ts seed:run
//It was also added to package.json

import Knex from 'knex'

export async function seed(knex: Knex) {

    await knex('items').insert([
        { title: 'Lâmpadas', image: 'lampadas.svg' },
        { title: 'Pilhas e Baterias', image: 'baterias.svg' },
        { title: 'Papéis e Papelão', image: 'papeis-papelao.svg' },
        { title: 'Residuos Eletronicos', image: 'eletronicos.svg' },
        { title: 'Residuos Organicos', image: 'organicos.svg' },
        { title: 'Oleo de Cozinha', image: 'oleo.svg' }

    ])

}