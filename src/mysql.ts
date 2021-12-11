import mysql, {Connection, ConnectionOptions, RowDataPacket} from 'mysql2/promise';
import {Colors} from './colors';
import {output} from './helpers';
import {getState} from './state';

export interface MysqlRow extends RowDataPacket {}

export const createConnection = async (): Promise<Connection> => {
    try {
        const {host, user, password, database, port} = getState();
        const options: ConnectionOptions = {
            host,
            user,
            password,
            database,
            port,
        };

        return await mysql.createConnection(options);
    } catch (e) {
        output.print((e as Error).message, Colors.FgRed);
        process.exit(1);
    }
};

export default mysql;
