import { Deserializable } from './Deserializable.model';
export class User implements Deserializable {
  Id: number;
  Login: string;
  Password: string;
  constructor(Id: number, theName: string, password: string) {this.Id = Id ; this.Login = theName; this.Password = password; }
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
