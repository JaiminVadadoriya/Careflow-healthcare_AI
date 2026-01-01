import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ReceptionistService } from '../../features/receptionist-dashboard/receptionist.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chatbot.component.html',
})
export class ChatbotComponent implements OnInit {
  messages: any[] = [];
  userInput = '';
  selectedValue = '';

  step = 0;
  form: any = {};
  doctors: any[] = [];

  askInput = false;
  inputPlaceholder = '';

  constructor(private service: ReceptionistService) {}

  ngOnInit() {
    this.botMessage('👋 Welcome! Would you like to book a new appointment?', [
      { text: 'Yes', value: 'yes' },
      { text: 'No', value: 'no' },
    ]);
  }

  botMessage(text: string, buttons?: any[], select?: any) {
    this.messages.push({ from: 'bot', text, buttons, select });
    this.askInput = !buttons && !select;
    this.inputPlaceholder = this.askInput ? 'Type here...' : '';
  }

  userMessage(text: string) {
    this.messages.push({ from: 'user', text });
  }

  handleSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.handleAction(value);
  }

  handleAction(value: any) {
    this.userMessage(value);
    if (this.step === 0) {
      if (value === 'yes') {
        this.step = 1;
        this.botMessage('Great! What is your full name?');
      } else {
        this.botMessage('Okay, feel free to start anytime!');
      }
    } else if (this.step === 1) {
      this.form.name = value;
      this.step = 2;
      this.botMessage('Loading available doctors...');
      this.loadDoctors();
    } else if (this.step === 2) {
      this.form.doctorId = value;
      this.step = 3;
      this.botMessage('Great! Pick a date/time (YYYY-MM-DDTHH:mm):');
    } else if (this.step === 4) {
      this.form.reason = value;
      this.step = 5;
      this.botMessage(
        `Thanks! Booking appointment for ${this.form.name} with selected doctor on ${this.form.date_time}. Confirm?`,
        [
          { text: 'Confirm', value: 'confirm' },
          { text: 'Cancel', value: 'cancel' },
        ]
      );
    } else if (this.step === 5) {
      if (value === 'confirm') this.submitAppointment();
      else this.botMessage('Booking canceled.', []);
    }
  }

  submitInput() {
    const val = this.userInput.trim();
    if (!val) return;
    this.userMessage(val);
    this.userInput = '';
    if (this.step === 3) {
      this.form.date_time = val;
      this.step = 4;
      this.botMessage('Can you briefly state the reason?');
    }
  }

  loadDoctors() {
    this.service.getDoctors().subscribe((res: any) => {
      this.doctors = res.data || res;
      // Replace the last message with doctor select
      this.messages.pop(); // remove "Loading available doctors..."
      this.botMessage('Please select a doctor:', [], {
        options: this.doctors.map((d) => ({
          label: d.full_name,
          value: d._id,
        })),
      });
    });
  }

  submitAppointment() {
    const payload = {
      patientId: 'SELF',
      doctorId: this.form.doctorId,
      date_time: this.form.date_time,
      reason: this.form.reason,
    };
    this.service.bookAppointment(payload).subscribe({
      next: () =>
        this.botMessage('✅ Your appointment was booked successfully!'),
      error: () => this.botMessage('❌ There was an error booking. Try again.'),
    });
  }
}
