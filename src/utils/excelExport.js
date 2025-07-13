import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportExcel = () =>{
    const wb = XLSX.utils.book_new();
    
    const data = [{ name: 'John', age: 28 }, { name: 'Jane', age: 34 }];
    const Heading = [
        ['Sr No', 'User Name', 'Department', 'Bank', 'Country', 'Region', 'Amount']
    ];
    
    // creating sheet and adding data from 2nd row of column A.
    // leaving first row to add Heading
    const ws = XLSX.utils.json_to_sheet(data, { origin: 'A2', skipHeader: true });
        
    // adding heading to the first row of the created sheet.
    // sheet already have contents from above statement.
    XLSX.utils.sheet_add_aoa(ws, Heading, { origin: 'A1' });
        
    // appending sheet with a name
    XLSX.utils.book_append_sheet(wb, ws, 'Records');
        
    const fileContent = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    const blob = new Blob([fileContent], { type: 'application/octet-stream' });
    saveAs(blob, 'example.xlsx');
}