import { Deserializable } from './Deserializable.model';
export class Websites implements Deserializable {
  Id: number;
  Name: string;
  Link: string;
  IdUser: number;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
