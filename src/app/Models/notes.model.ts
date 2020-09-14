import { Deserializable } from './Deserializable.model';
import { User } from './User.model';
export class Notes implements Deserializable {
  Id: number;
  Text: string;
  IdUser: number;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
