//Import the QueryBuilder
import knex from 'knex'

//This is importante using paths
//It will treat the path for different S.O for example
import path from 'path'

//__dirname: Retorna o diretório do arquivo pelo qual foi chamado

const connection = knex ({
    //Remember to: npm i sqlite3
    client: 'sqlite3',
    connection: {
        //This will make a kind of "local database"
        //The database will be the "database.sqlite" file
        filename: path.resolve(__dirname, 'database.sqlite')
    },
    useNullAsDefault: true
})

//Exports....
export default connection;