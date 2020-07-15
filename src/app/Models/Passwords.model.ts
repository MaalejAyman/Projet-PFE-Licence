import { Deserializable } from './Deserializable.model';
export class Passwords implements Deserializable {
  Id: number;
  Login: string;
  Value: string;
  Value2: string;
  Score: number;
  IdGrp: number;
  IdFldr: number;
  IdWs: number;
  IdUser: number;
  Groupes: number[];
  PasswordCrypPubs: string[];
  GrpName: string;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
