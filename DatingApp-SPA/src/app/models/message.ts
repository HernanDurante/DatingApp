export interface Message {
  id: number;
  senderId: number;
  senderKnownAs: string;
  recipientId: number;
  recipientKnownAs: string;
  senderPhotoUrl: string;
  recipientPhotoUrl: string;
  content: string;
  isRead: boolean;
  dateRead: Date;
  messageSent: Date;
}

