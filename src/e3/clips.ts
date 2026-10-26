// Edit3 clips registered in Root.tsx: [composition id, component, length ms]
import type {FC} from 'react';
import {LEFTY_MS, Lefty} from './Lefty';
import {TICKET_MS, TicketEdit} from './Ticket';
import {FOURSOME_MS, Foursome} from './Foursome';
import {CELLY_MS, Celly} from './Celly';
import {TRUEGOLD_MS, TrueGold} from './TrueGold';
import {PLAYBOOK_MS, Playbook} from './Playbook';

export const E3_CLIPS: [string, FC, number][] = [
  ['E3Lefty', Lefty, LEFTY_MS],
  ['E3Ticket', TicketEdit, TICKET_MS],
  ['E3Foursome', Foursome, FOURSOME_MS],
  ['E3Celly', Celly, CELLY_MS],
  ['E3TrueGold', TrueGold, TRUEGOLD_MS],
  ['E3Playbook', Playbook, PLAYBOOK_MS],
];
