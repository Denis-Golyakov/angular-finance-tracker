import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryIconSearch } from './category-icon-search';

describe('CategoryIconSearch', () => {
  let component: CategoryIconSearch;
  let fixture: ComponentFixture<CategoryIconSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryIconSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryIconSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
