export interface ConfirmDialogData {
  title: string;
  message: string;
  messageParams?: Record<string, unknown>;
  confirmLabel?: string;
  cancelLabel?: string;
}