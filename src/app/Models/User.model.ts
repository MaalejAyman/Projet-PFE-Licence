import { Deserializable } from './Deserializable.model';
export class User implements Deserializable {
  id: number;
  name: string;
  password: string;
  constructor(Id: number, theName: string, password: string) {this.id = Id ; this.name = theName; this.password = password; }
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
