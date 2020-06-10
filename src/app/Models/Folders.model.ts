import { Deserializable } from './Deserializable.model';
export class Folders implements Deserializable {
  Id: number;
  Name: string;
  IdParentFolder: number;
  InverseIdParentFolderNavigation: Folders;
  IdUser: number;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
