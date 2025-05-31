import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Entry, EntryCreate, EntryService } from '../../data-access/entries.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
    selector: 'app-entry-form',
    imports: [ReactiveFormsModule],
    templateUrl: './entry-form.component.html',
    providers: [EntryService],
})
export default class EntryFormComponent {
  private _formBuilder = inject(FormBuilder);
  private _entryService = inject(EntryService);
  private _router = inject(Router);

  loading = signal(false);

  id = input.required<string>();

  form = this._formBuilder.group({
    content: this._formBuilder.control('', Validators.required),
    marker: this._formBuilder.control(false, Validators.required),
  });

  constructor() {
    effect(() => {
      const id = this.id();
      if (id) {
        this.getTask(id);
      }
    });
  }

  async submit() {
    if (this.form.invalid) return;

    try {
      this.loading.set(true);
      const { content: content, marker } = this.form.value;
      const task: EntryCreate = {
        content: content || '',
        marker: !!marker,
      };

      const id = this.id();
      if (id) {
        await this._entryService.update(task, id);
      } else {
        await this._entryService.create(task);
      }

      toast.success(`Task ${id ? 'updated' : 'created'} `);
      this._router.navigateByUrl('/entries');
    } catch (error) {
      toast.error('An error ocurred ' + error);
    } finally {
      this.loading.set(false);
    }
  }

  async getTask(id: string) {
    const taskSnapshot = await this._entryService.getEntry(id);

    if (!taskSnapshot.exists()) return;

    const task = taskSnapshot.data() as Entry;

    this.form.patchValue(task);
  }
}
