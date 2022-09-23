const terminalSize = require('term-size')
const Table = require('cli-table')

module.exports = (portfolios) => {

	const teSi = terminalSize();
    const singleColumn = Math.floor(teSi.columns / 12);

    const table = new Table({
        head: portfolios[0],
        chars: {
            'top': '═', 
            'top-mid': '╤', 
            'top-left': '╔', 
            'top-right': '╗', 
            'bottom': '═', 
            'bottom-mid': '╧', 
            'bottom-left': '╚', 
            'bottom-right': '╝', 
            'left': '║', 
            'left-mid': '╟',
            'mid': '─', 
            'mid-mid': '┼', 
            'right': '║', 
            'right-mid': '╢', 
            'middle': '│'
        },
        colWidths: [singleColumn, singleColumn, singleColumn, singleColumn * 2, singleColumn * 6]
    })

    for(const e of portfolios[1]) {
        const ele = Object.values(e)
        table.push(ele)
    }

    console.log(table.toString());

    if (!table.length) {
        console.log('Data not found')
    }

}