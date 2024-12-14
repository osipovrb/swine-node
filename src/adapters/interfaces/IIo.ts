export interface IIo {
  read(msg: string, authorId: string, roomId: string): Promise<void>
  write(msg: string, roomId: string): Promise<void>
}
