const moment = require('moment');
const _ = require('lodash');

const PdfService = require('./pdfService');

class TimePdfService extends PdfService {
    addTable(data) {
        const columns = [
            {
                text: 'Length (hrs)',
                value: 'length',
                width: '10%',
            },
            {
                text: 'Note',
                value: 'note',
                width: '60%',
            },
            {
                text: 'Assignee',
                value: 'user',
                parse: (value) => `${value.firstName} ${value.lastName}`,
                width: '30%',
            },
        ];

        super.addTable(data, columns);
    }

    async createFile(data) {
        this.addHeader('Toptal Time Management');
        this.addSubheader('Time entries');
        
        const groupedData = _.groupBy(data, 'date');

        Object.keys(groupedData).forEach((date) => {
            this.addText(moment(date).format('DD MMM YYYY'), { fontSize: 12, bold: true, margin: [0, 20, 0, 10] });
            this.addTable(groupedData[date]);
        });

        return super.createFile(`toptal_time_management_time_export_${moment().format('YYYYMMDDHHmmss')}.pdf`);
    }
}

module.exports = TimePdfService;
