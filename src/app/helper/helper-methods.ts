export function formatDateRange(startDate : any, endDate: any) {
    if(startDate=='' || endDate=='') return {start :'', end:''};
    return {start :formatDate(startDate), end:formatDate(endDate)};
  }

  export function formatDate(date : any) {
    if(date=='' ) return '';
    var ar= (<Date> date).toLocaleDateString().split('/').map(d=>d.length==1? '0'+d : d);  
    var _date = ar[2]+'-'+ar[0]+'-'+ar[1]; 
    return _date;
  }