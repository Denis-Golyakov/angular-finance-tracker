import { Component, inject, input, output, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subject, Observable, switchMap, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { CategoryIconSearchItem } from '@/components/category-icon-search-item/category-icon-search-item';

@Component({
  selector: 'category-icon-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryIconSearchItem,
    FormsModule,
    NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    NgSelectComponent
  ],
  templateUrl: './category-icon-search.html',
  styleUrl: './category-icon-search.scss',
})
export class CategoryIconSearch {
  private readonly cdr = inject(ChangeDetectorRef);

  item = input.required<string | undefined>();

  icons: any[] = [];
  selectedIcon: string | undefined = '';
  typeahead = new Subject<string>();
  loading = false;

  readonly http = inject(HttpClient);

  ngOnInit() {
    this.selectedIcon = this.item();

    this.typeahead.pipe(
      switchMap(term => {
        this.loading = true;
        return this.searchIcons(term);
      })
    ).subscribe(icons => {
      this.icons = icons;
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  searchIcons(term: string): Observable<any[]> {
    if (!term || term.length < 2) return of([]);
    return this.http.get<any>(`https://api.iconify.design/search?query=${term}&limit=24`)
      .pipe(
        map(data => data.icons ?? []),
        catchError(() => of([]))
      );
  }

  onChange = output<string>();

  onChangeEvent(event: string) {
    this.onChange.emit(event);
  }
}
