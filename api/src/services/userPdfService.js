const moment = require('moment');

const PdfService = require('./pdfService');
const appConstants = require('../constants/app');

const { roles } = appConstants.user;

class UserPdfService extends PdfService {
    addTable(data) {
        const columns = [
            {
                text: 'Id',
                value: 'id',
                width: '5%',
            },
            {
                text: 'First name',
                value: 'firstName',
                width: '15%',
            },
            {
                text: 'Last name',
                value: 'lastName',
                width: '15%',
            },
            {
                text: 'Email',
                value: 'email',
                width: '30%',
            },
            {
                text: 'Role',
                value: 'role',
                parse: (value) => Object.keys(roles).find(roleName => roles[roleName] === value),
                width: '15%',
            },
            {
                text: 'Date created',
                value: 'createdAt',
                parse: (value) => moment(value).format('DD MMM YYYY [at] HH:mm'),
                width: '20%',
            },
        ];

        super.addTable(data, columns);
    }

    async createFile(data) {
        this.addHeader('Toptal Time Management');
        this.addSubheader('Users');
        this.addTable(data);

        return super.createFile(`toptal_time_management_user_export_${moment().format('YYYYMMDDHHmmss')}.pdf`);
    }
}

module.exports = UserPdfService;
