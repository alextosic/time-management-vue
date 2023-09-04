const pdfmake = require('pdfmake');
const path = require('path');

class PdfService {
    constructor() {
        const fontsPath = path.join(__dirname, '..', 'assets', 'fonts', 'Roboto');

        this.printer = new pdfmake({
            Roboto: {
                normal: path.join(fontsPath, 'Roboto-Regular.ttf'),
                bold: path.join(fontsPath, 'Roboto-Medium.ttf'),
                italics: path.join(fontsPath, 'Roboto-Italic.ttf'),
                bolditalics: path.join(fontsPath, 'Roboto-MediumItalic.ttf'),
            },
        });

        this.definition = {
            content: [],
            styles: {
                header: {
                    fontSize: 18,
			        bold: true,
                    margin: [0, 0, 0, 20],
                    alignment: 'center',
                },
                subheader: {
                    fontSize: 16,
                    margin: [0, 0, 0, 20],
                },
                tableHeader: {
                    bold: true,
                    fontSize: 14,
                },
            },
        };
    }

    addHeader(text) {
        this.definition.content.push({ text, style: 'header' });
    }

    addSubheader(text) {
        this.definition.content.push({ text, style: 'subheader' });
    }

    addText(text, options) {
        this.definition.content.push({ text, ...options });
    }

    addTable(data, columns) {
        this.definition.content.push({
            table: {
                headerRows: 1,
                widths: columns.map(column => column.width),
                body: [
                    columns.map(column => ({ text: column.text, style: 'tableHeader' })),
                    ...data.map(datapoint => columns.map(column =>
                        column.parse ? column.parse(datapoint[column.value]) : datapoint[column.value])
                    ),
                ],
            }
        });
    }

    async createFile(name) {
        return new Promise((resolve, reject) => {
            try {
                const document = this.printer.createPdfKitDocument(this.definition);
                const chunks = [];
    
                document.on('data', chunk => chunks.push(chunk));
                document.on('end', () => {
                    const result = Buffer.concat(chunks);
                    return resolve({
                        file: `data:application/pdf;base64,${result.toString('base64')}`,
                        name,
                    });
                });
    
                document.end();
            } catch (err) {
                return reject(err);
            }
        });
    }
}

module.exports = PdfService
