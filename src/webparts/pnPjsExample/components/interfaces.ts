// File: interfaces.ts

export interface IResponseItem {
  Id: number;
  Title?: string;
  FileLeafRef: string;
  File: {
    Length: number;
  };
}



// interfaces.ts
export interface IFile {
  Id: number;
  Name: string;
  Size: number;
  Library: 'Documents' | 'Site Pages';
}




export type LibraryType = 'Documents' | 'Site Pages';

export interface ICombinedItem extends IFile {
  Library: LibraryType;
}