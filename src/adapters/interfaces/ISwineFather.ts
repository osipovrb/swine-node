export interface ISwineFather {
  name(roomId: string, userId: string, swineName: string): Promise<string>;
  my(roomId: string, userId: string): Promise<string>;
  grow(roomId: string, userId: string): Promise<string>;
  top(roomId: string): Promise<string>;
}
