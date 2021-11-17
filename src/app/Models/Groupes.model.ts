import { Deserializable } from './Deserializable.model';
import { User } from './User.model';
export class Groupes implements Deserializable {
  Id: number;
  Name: string;
  Users?: User[];
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
