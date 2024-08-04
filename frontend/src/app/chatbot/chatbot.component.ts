import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent {
  messages: { text: string; isUser: boolean }[] = [];
  userInput: string = '';
  step: number = 0;

  handleUserInput() {
    if (!this.userInput.trim()) return;

    this.messages.push({ text: this.userInput, isUser: true });

    this.processResponse(this.userInput.trim().toLowerCase());
    this.userInput = '';
  }

  processResponse(input: string) {
    let response = '';

    switch (this.step) {
      case 0:
        response =
          'Welcome to Hospital Chatbot! What service do you need? (e.g., book an appointment)';
        this.step++;
        break;
      case 1:
        if (input.includes('appointment')) {
          response = 'Sure! Please provide your name.';
          this.step++;
        } else {
          response = 'Sorry, I can only help with scheduling appointments.';
        }
        break;
      case 2:
        response = `Thank you, ${input}. What date would you like to schedule your appointment?`;
        this.step++;
        break;
      case 3:
        response = `Got it! Your appointment is scheduled for ${input}. Thank you for using our service!`;
        this.step = 0; // Reset for the next user interaction
        break;
      default:
        response = 'Sorry, I didn’t understand that.';
        this.step = 0;
    }

    this.messages.push({ text: response, isUser: false });
  }
}
