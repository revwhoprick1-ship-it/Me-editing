// Edit3 clips registered in Root.tsx: [composition id, component, length ms]
import type {FC} from 'react';
import {LEFTY_MS, Lefty} from './Lefty';
import {TICKET_MS, TicketEdit} from './Ticket';
import {FOURSOME_MS, Foursome} from './Foursome';
import {CELLY_MS, Celly} from './Celly';
import {TRUEGOLD_MS, TrueGold} from './TrueGold';
import {PLAYBOOK_MS, Playbook} from './Playbook';
import {PRESNAP_MS, PreSnap} from './PreSnap';
import {NTRIP_MS, NtRip} from './NtRip';
import {ROGERS_MS, Rogers} from './Rogers';
import {LAIR_MS, Lair} from './Lair';
import {KABOOM_MS, Kaboom} from './cards/Kaboom';
import {PRESIDENTS_MS, Presidents} from './cards/Presidents';
import {GODPACK_MS, GodPack} from './cards/GodPack';
import {BUZZ_MS, Buzz} from './cards/Buzz';

export const E3_CLIPS: [string, FC, number][] = [
  ['E3Lefty', Lefty, LEFTY_MS],
  ['E3Ticket', TicketEdit, TICKET_MS],
  ['E3Foursome', Foursome, FOURSOME_MS],
  ['E3Celly', Celly, CELLY_MS],
  ['E3TrueGold', TrueGold, TRUEGOLD_MS],
  ['E3Playbook', Playbook, PLAYBOOK_MS],
  ['B3PreSnap', PreSnap, PRESNAP_MS],
  ['B3NtRip', NtRip, NTRIP_MS],
  ['B3Rogers', Rogers, ROGERS_MS],
  ['B3Lair', Lair, LAIR_MS],
  ['B3Kaboom', Kaboom, KABOOM_MS],
  ['B3Presidents', Presidents, PRESIDENTS_MS],
  ['B3GodPack', GodPack, GODPACK_MS],
  ['B3Buzz', Buzz, BUZZ_MS],
];
