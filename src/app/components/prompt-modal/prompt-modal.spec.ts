import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptModal } from './prompt-modal';

describe('PromptModal', () => {
  let component: PromptModal;
  let fixture: ComponentFixture<PromptModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PromptModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
