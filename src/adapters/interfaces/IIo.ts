export interface IIo {
  nameCommand(msg: string, authorId: string, roomId: string): Promise<void>
  myCommand(roomId: string, userId: string): Promise<void>
  growCommand(roomId: string, userId: string): Promise<void>
  topCommand(roomId: string): Promise<void>
  write(roomId: string, msg: string): Promise<void>
}
