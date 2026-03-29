import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSelectItem } from './color-select-item';

describe('ColorSelectItem', () => {
  let component: ColorSelectItem;
  let fixture: ComponentFixture<ColorSelectItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorSelectItem],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorSelectItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
