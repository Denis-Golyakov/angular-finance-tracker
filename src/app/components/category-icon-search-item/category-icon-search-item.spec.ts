import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryIconSearchItem } from './category-icon-search-item';

describe('CategoryIconSearchItem', () => {
  let component: CategoryIconSearchItem;
  let fixture: ComponentFixture<CategoryIconSearchItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryIconSearchItem],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryIconSearchItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
