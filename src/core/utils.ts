// MONTH abbreviation to digit lookup.
export const MONTHS: any = {
    'jan': 1, 'feb': 2, 'fév': 2, 'mar': 3, 'apr': 4,
    'avr': 4, 'mai': 5, 'may': 5, 'jun': 6, 'jul': 7,
    'aoû': 8, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11,
    'dec': 12, 'déc': 12
};

export type Option<T> = T | null;

export class Row<T> {
    constructor(table: Table<T>, cells: Array<T>) {
        this._table = table;
        this._cells = cells;
    }

    public get(cell: number | string): T {
        let index: number = -1;
        if (typeof (cell) === 'number')
            index = cell;
        else if (typeof (cell) === 'string') {
            index =  this._table.getColumnIndex(cell) || -1;
        }
        if (cell < 0 || cell >= this._cells.length) 
            throw new Error('Unknown column name or invalid index');

        return this._cells[index];
    }

    /** Iterates the cells of a row. */
    public eachCell(c: (a0: number, a1: T) => void): void {

    }

    private _cells: Array<T>;
    private _table: Table<T>;
}

export class Table<T> {
    constructor(private _headers: Array<string>, rows: Array<Row<T>>) {
        this._rows = rows;
    };

    public get rows(): Readonly<Array<Readonly<Row<T>>>> {
        return this._rows;
    }

    /**
     * @param header the header name to resolve.
     * @returns the index of the column corresponding to a header.
     */
    public getColumnIndex(header: string): Option<number> {
        let idx = this._headers.indexOf(header);
        return idx > 0 ? idx : null;
    }

    public forEach(f: (value: Row<T>, index: number) => void) {
        this._rows.forEach(f, this);
    }

    public map<R>(f: (value: Row<T>, index: number) => R): Array<R> {
        return this._rows.map(f, this);
    }

    private _rows: Array<Row<T>>;
}

/** Parse the DOM and extract the first table rooted in the given tree.
 * 
 * @param e The root DOM object to use. 
 * @param converter A function to convert strings to the row type.
 * @param pred A predicate to determine if the row is valid data.
 * 
 * TODO: There might be a way to force the converter unless T is string.
 */
export function extractTable<T>(
    e: HTMLElement,
    pred?: (row: Row<T>) => boolean,
    converter?: (input: string) => T
): Option<Table<T>> {
    if (!e) return null;

    let table = (e.tagName.toLowerCase() !== 'table')
        ? e.getElementsByTagName('table')[0]
        : e; // Element is already a table.

    // Extract the table headers.
    let headers: Array<string> = [];
    let ths = table.getElementsByTagName('thead');
    if (ths && ths.length > 0) {
        for (let th of ths[0].getElementsByTagName('th'))
            headers.push(th.innerText);
    } else {
        // TODO: No header.
    }

    // Extract table rows.
    let rs = table.getElementsByTagName('tr');

    // Skip the header and parse all rows.
    // FIXME: If header is not first row, this will fail.
    let rows: Array<Row<T>> = [];
    let result = new Table<T>(headers, rows);

    for (var i = 1; i < rs.length; i += 1) {
        let r = rs[i];
        let cells = new Array<T>();
        let row = new Row(result, cells);

        for (var c = 0; c < r.cells.length; c += 1) {
            const data = r.cells[c].innerText;
            cells.push(converter ? converter(data) : <T>(<unknown>data));
        }

        if (!pred || (pred && pred(row)))
            rows.push(row);
    }

    return result;
}
