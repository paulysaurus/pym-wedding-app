export interface GuestRsvp {
  id: string;
  invitationCode: string;
  guestName: string;
  maxPasses: number;
  confirmedPasses: number;
  isAttending: boolean | null;
  dietaryRestrictions?: string;
  songRequest?: string;
  messageForCouple?: string;
}

export interface RsvpPayload {
  invitationCode: string;
  isAttending: boolean;
  confirmedPasses: number;
  dietaryRestrictions?: string;
  songRequest?: string;
  messageForCouple?: string;
}
