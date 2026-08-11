import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ContactMessage } from '../../core/models/contact-message.model';
import { ContactMessageService } from '../../core/services/contact-message.service';
import { SettingsService } from '../../core/services/settings.service';
import { ToastService } from '../../core/services/toast.service';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { ModalComponent } from '../../shared/ui/modal.component';

@Component({
  selector: 'app-message-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, EmptyStateComponent, IconComponent, ModalComponent],
  templateUrl: './message-list.component.html',
})
export class MessageListComponent implements OnInit {
  private readonly messages = inject(ContactMessageService);
  private readonly toast = inject(ToastService);
  private readonly settings = inject(SettingsService);

  protected readonly items = signal<ContactMessage[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly query = signal('');
  protected readonly updatingId = signal<string | null>(null);
  protected readonly selected = signal<ContactMessage | null>(null);

  protected readonly unreadCount = computed(
    () => this.items().filter((m) => !m.read).length,
  );

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const sorted = [...this.items()].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
    return q
      ? sorted.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            m.message.toLowerCase().includes(q),
        )
      : sorted;
  });

  ngOnInit(): void {
    this.messages.list().subscribe({
      next: (list) => {
        this.items.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load messages.');
      },
    });
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected openDetail(item: ContactMessage): void {
    this.selected.set(item);
    if (!item.read) {
      this.toggleRead(item, { notify: false });
    }
  }

  protected closeDetail(): void {
    this.selected.set(null);
  }

  protected toggleRead(item: ContactMessage, opts: { notify?: boolean } = {}): void {
    const nextRead = !item.read;
    this.updatingId.set(item._id);
    this.messages.markRead(item._id, nextRead).subscribe({
      next: (updated) => {
        this.updatingId.set(null);
        this.items.update((list) =>
          list.map((m) => (m._id === updated._id ? updated : m)),
        );
        if (this.selected()?._id === updated._id) {
          this.selected.set(updated);
        }
        if (opts.notify ?? true) {
          this.toast.success(updated.read ? 'Marked as read.' : 'Marked as unread.');
        }
      },
      error: () => {
        this.updatingId.set(null);
        this.toast.error('Could not update this message.');
      },
    });
  }

  protected mailtoHref(item: ContactMessage): string {
    const storeName = this.settings.store().storeName;
    return `mailto:${item.email}?subject=${encodeURIComponent(`Re: your message to ${storeName}`)}`;
  }
}
