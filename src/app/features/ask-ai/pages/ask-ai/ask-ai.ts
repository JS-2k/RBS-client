import { AfterViewChecked, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideBrainCircuit,
  LucidePanelTop,
  LucideSendHorizontal,
  LucideSparkles,
} from '@lucide/angular';

import { GeminiService } from '../../../../core/ai/gemini.service';

type Suggestion = {
  label: string;
  prompt: string;
};

type ChatMessage = {
  role: 'assistant' | 'user';
  text: string;
};

@Component({
  selector: 'app-ask-ai',
  imports: [
    FormsModule,
    LucideBrainCircuit,
    LucidePanelTop,
    LucideSendHorizontal,
    LucideSparkles,
  ],
  templateUrl: './ask-ai.html',
  styleUrl: './ask-ai.css',
})
export class AskAi implements AfterViewChecked {
  @ViewChild('messageScroller') private messageScroller?: ElementRef<HTMLElement>;

  private readonly gemini = inject(GeminiService);
  private lastScrollState = '';

  protected prompt = '';
  protected readonly assistantName = 'Aira';

  protected readonly suggestions: Suggestion[] = [
    {
      label: 'Summarize outstanding',
      prompt: 'Summarize customer outstanding balances and group them by priority.',
    },
    {
      label: 'Draft payment follow-up',
      prompt: 'Draft a short follow-up message for invoices pending payment.',
    },
    {
      label: 'Check sales attention',
      prompt: 'Compare recent invoices and identify products that need attention.',
    },
    {
      label: 'Plan today',
      prompt: 'Create a practical follow-up plan for today using customers, invoices, and payments.',
    },
  ];

  protected readonly messages = signal<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Hi, I am Aira. I can help with customers, invoices, payments, products, quotations, and reports. What should we work on?',
    },
  ]);
  protected readonly isAsking = signal(false);

  ngAfterViewChecked(): void {
    const scrollState = `${this.messages().length}-${this.isAsking()}`;

    if (scrollState === this.lastScrollState) {
      return;
    }

    this.lastScrollState = scrollState;
    this.scrollToBottom();
  }

  protected async useSuggestion(suggestion: Suggestion): Promise<void> {
    this.prompt = suggestion.prompt;
    await this.generateResponse();
  }

  protected async generateResponse(): Promise<void> {
    const cleanPrompt = this.prompt.trim();

    if (!cleanPrompt) {
      return;
    }

    this.isAsking.set(true);
    this.prompt = '';
    this.messages.update((messages) => [...messages, { role: 'user', text: cleanPrompt }]);

    try {
      const answer = await this.gemini.ask(cleanPrompt);
      this.messages.update((messages) => [...messages, { role: 'assistant', text: answer }]);
    } finally {
      this.isAsking.set(false);
      this.resetPromptInputHeight();
    }
  }

  protected clearChat(): void {
    this.messages.set([
      {
        role: 'assistant',
        text: 'Fresh chat started. Aira is ready for customers, invoices, payments, products, quotations, or reports.',
      },
    ]);
    this.prompt = '';
    this.resetPromptInputHeight();
  }

  protected resizePromptInput(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 180)}px`;
  }

  private scrollToBottom(): void {
    const scroller = this.messageScroller?.nativeElement;

    if (!scroller) {
      return;
    }

    scroller.scrollTo({
      top: scroller.scrollHeight,
      behavior: 'smooth',
    });
  }

  private resetPromptInputHeight(): void {
    window.setTimeout(() => {
      const input = document.querySelector<HTMLTextAreaElement>('.chat-composer-input');

      if (input) {
        input.style.height = 'auto';
      }
    });
  }
}
