import {
  Component,
  inject,
  input,
} from '@angular/core';
import { Entry, EntryService } from '../../data-access/entries.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-table',
  imports: [RouterLink],
  templateUrl: './table.component.html'
})
export class TableComponent {

  entries = input.required<Entry[]>();
  private _entryService = inject(EntryService)
 
  
  async deleteEntry(id: string, name: string) {
  /////////////////////// Функция удаление записи из базы
    try {
      await this._entryService.delete(id);
    } catch (error) {
      console.log(error);

    } finally {

    }
    }
  }


