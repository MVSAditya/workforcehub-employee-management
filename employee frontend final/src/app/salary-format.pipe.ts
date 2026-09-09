import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'salaryFormat'
})
export class SalaryFormatPipe implements PipeTransform {

  transform(value: number | string): string {
    const amount = Number(value);
    if (isNaN(amount)) {
      return '₹ 0';
    }

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
}
