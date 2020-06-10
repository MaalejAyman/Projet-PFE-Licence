import { Deserializable } from './Deserializable.model';
export class Passwords implements Deserializable {
  Id: number;
  Login: string;
  Value: string;
  Score: number;
  IdGrp: number;
  IdFldr: number;
  IdWs: number;
  IdUser: number;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
