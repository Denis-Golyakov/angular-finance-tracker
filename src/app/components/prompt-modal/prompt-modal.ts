import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';

@Component({
  selector: 'prompt-modal',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './prompt-modal.html',
  styleUrl: './prompt-modal.scss',
})
export class PromptModal {
  readonly message = input.required<string>()
  readonly confirmText = input.required<string>()
  readonly cancelText = input.required<string>()
  readonly icon = input('heroicons-outline:exclamation')

  readonly onCancel = output<void>()
  readonly onConfirm = output<void>()

  onCancelEvent() {
    this.onCancel.emit()
  }
  onConfirmEvent() {
    this.onConfirm.emit()
  }
}
