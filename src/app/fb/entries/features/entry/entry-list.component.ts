import { Component, inject, OnInit } from '@angular/core';
import { TableComponent } from '../../ui/table/table.component';
// import { RouterLink } from '@angular/router';
import { EntryService } from '../../data-access/entries.service';

@Component({
    selector: 'app-entry-list',
    imports: [TableComponent],
    templateUrl: './entry-list.component.html',
    providers: [EntryService]
})
export default class EntryListComponent {
  entryService = inject(EntryService);
}
