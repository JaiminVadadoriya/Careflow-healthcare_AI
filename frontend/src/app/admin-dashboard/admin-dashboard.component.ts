import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import { BaseChartDirective, } from 'ng2-charts';
import {MatCardModule} from '@angular/material/card';


// Register all Chart.js components (or selectively register only what you need)
Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [BaseChartDirective, CommonModule,MatCardModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  public chartLabels: string[] = this.getMonthLabels(); // Labels for the bar chart
  public chartData: number[] = this.getRandomData(); // Random data for the bar chart

  // Get the current month
  public currentMonth = new Date().getMonth();

  // Sample recent queries data
  public queries = [
    { medicine: 'Paracetamol', date: '2024-10-01', trend: 'up' },
    { medicine: 'Ibuprofen', date: '2024-10-02', trend: 'down' },
    { medicine: 'Amoxicillin', date: '2024-10-03', trend: 'up' },
    { medicine: 'Aspirin', date: '2024-10-04', trend: 'down' },
  ];

  // Create the background color array where the current month has a different color
  chartColors: string[] = this.chartLabels.map((label, index) =>
    index === this.chartLabels.length-1 ? '#398484' : '#00bdbc'  // Red for the current month, blue for others
  );

  public trendChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    // scales: {
    //   x: {
    //     title: {
    //       display: true,
    //       text: 'Days',
    //     },
    //   },
    //   y: {
    //     title: {
    //       display: true,
    //       text: 'Queries',
    //     },
    //   },
    // },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Function to generate random data for the bar chart
  private getRandomData(): number[] {
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));
  }

  // Function to get month labels from January to current month
  private getMonthLabels(): string[] {
    const currentMonth = new Date().getMonth();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    // Get the months starting from next month to the current month
  const nextMonths = months.slice(currentMonth+1,months.length);  // Months from next month
  const previousMonths = months.slice(0, currentMonth+1);  // Months before current month
  const result = [...nextMonths, ...previousMonths];  // Combine them in the required order

  return result;
  }

  // Function to get trend data based on trend direction
  public getTrendData(trend: string): ChartData<'line'> {
    const trendData = trend === 'up' ? [10, 20, 30, 40] : [40, 30, 20, 10]; // Sample trend data
    return {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4'],
      datasets: [
        {
          data: trendData,
          label: trend === 'up' ? 'Increasing Trend' : 'Decreasing Trend',
          borderColor: trend === 'up' ? 'green' : 'red',
          fill: false,
        },
      ],
    };
  }
}
