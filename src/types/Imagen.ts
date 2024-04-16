export type Imagen = {
    index: number;
    file: File | null;
    ruta: string;
    fileName: string;
    downloadUrl: string;
    fileType: string;
    fileSize: number;
};