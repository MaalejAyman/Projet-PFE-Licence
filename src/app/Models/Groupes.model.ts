import { Deserializable } from './Deserializable.model';
export class Groupes implements Deserializable {
  Id: number;
  Name: string;
  IdUser: number;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
