export interface IRoomInfoModel {
  id: string;
  amountOfPeople: number;
  moisture: number;
  temperature: number;
  luminosity: number;
  date: number;
}

export interface ICreateRoomInfoModel extends Omit<IRoomInfoModel, "id"> {}
