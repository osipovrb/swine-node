export interface ISwineFather {
  name(roomId: string, userId: string, swineName: string): Promise<string>;
}
