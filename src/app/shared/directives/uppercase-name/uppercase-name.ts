import { Directive, ElementRef, inject, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercaseName]',
  host: {
    '(input)': 'onInput()',
  },
})
export class UppercaseName {
 private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  protected onInput(): void {
    const input = this.elementRef.nativeElement;
    const uppercased = input.value.toUpperCase();

    if (input.value !== uppercased) {
      this.renderer.setProperty(input, 'value', uppercased);
    }

    this.ngControl?.control?.setValue(uppercased, { emitEvent: false });
  }
}
