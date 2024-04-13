export type Imagen = {
    index: number;
    file: File | null;

    fileName: string;
    downloadUrl: string;
    fileType: string;
    fileSize: number;
};