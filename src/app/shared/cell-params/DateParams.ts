import { IDateFilterParams } from "ag-grid-community";

export const filterDateParams: IDateFilterParams = {
    comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
      var dateAsString = cellValue;
      if (dateAsString == null) return -1;
      var dateParts = dateAsString.split('/');
      var cellDate = new Date(
        Number(dateParts[2]),
        Number(dateParts[1]) - 1,
        Number(dateParts[0])
      );

      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }

      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }

      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
      return 0;
    },
    minValidYear: 2000,
    maxValidYear: 2021,
    inRangeFloatingFilterDateFormat: 'DD MMM YYYY',
  };