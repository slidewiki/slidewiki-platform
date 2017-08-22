import {Microservices} from '../configs/microservices';
import {SMTP} from '../configs/secrets';
import rp from 'request-promise';
import { isEmpty } from '../common.js';
import SMTPConnection from 'smtp-connection';
const log = require('../configs/log').log;

export default {
    name: 'email',
    // At least one of the CRUD methods is Required
    create: (req, resource, params, body, config, callback) => {
        if (!params.subject || !params.message)
            return callback('Error: Missing parameters', null);

        const to = SMTP.to, from = SMTP.from;

        let connection;
        try {
            connection = new SMTPConnection({
                host: SMTP.host,
                port: SMTP.port,
                name: SMTP.clientName,
                connectionTimeout: 4000,
                opportunisticTLS: true,
                tls: {
                    rejectUnauthorized: false
                }
            });
        }
        catch (e) {
            console.warn(e);
            return callback({message: 'Wrong SMTP configuration', error: e});
        }

        connection.on('error', (err) => {
            console.warn('ERROR on SMTP Client:', err);
            if (process.env.NODE_ENV !== 'production')
                return callback(null, {email: to, message:  'dummy'});//DEBUG
            return callback({message: 'Failed creating connection to SMTP server', error: err});
        });

        connection.connect((result) => {
            //Result of connected event
            // console.log('Connection established with result', result, 'and connection details (options, secureConnection, alreadySecured, authenticated)', connection.options, connection.secureConnection, connection.alreadySecured, connection.authenticated);

            connection.send({
                from: from,
                to: to
            },
            'From: <' + from + '>\r\n' + 'To: <' + to + '>\r\n' + 'Subject: ' + params.subject + '\r\nDate: ' + (new Date()).toGMTString() + '\r\n\r\n' + params.message,
            (err, info) => {
                // console.log('tried to send the email:', err, info);

                try {
                    connection.quit();
                }
                catch (e) {
                    console.warn({message: 'SMTP connection quit failed', error: e});
                }

                if (err !== null) {
                    return callback({message: 'Sending failed', error: err});
                }

                //handle info object
                if (info.rejected.length > 0) {
                    return callback({message: 'Email was rejected', error: info.rejected});
                }

                callback(null, {email: to, message: info.response});
            });
        });
    }
};
