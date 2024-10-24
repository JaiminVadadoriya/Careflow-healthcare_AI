import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import { BaseChartDirective, } from 'ng2-charts';


// Register all Chart.js components (or selectively register only what you need)
Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [BaseChartDirective, CommonModule,],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  public chartLabels: string[] = this.getMonthLabels(); // Labels for the bar chart
  public chartData: number[] = this.getRandomData(); // Random data for the bar chart

  // Sample recent queries data
  public queries = [
    { medicine: 'Paracetamol', date: '2024-10-01', trend: 'up' },
    { medicine: 'Ibuprofen', date: '2024-10-02', trend: 'down' },
    { medicine: 'Amoxicillin', date: '2024-10-03', trend: 'up' },
    { medicine: 'Aspirin', date: '2024-10-04', trend: 'down' },
  ];

  public trendChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Queries',
        },
      },
    },
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

    return months.slice(0, currentMonth + 1); // Return months from January to current month
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
