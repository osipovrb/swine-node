export interface IIo {
  nameCommand(msg: string, authorId: string, roomId: string): Promise<void>
  write(roomId: string, msg: string): Promise<void>
}
