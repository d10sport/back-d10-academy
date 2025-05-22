import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { responseS3File } from "../../common/enum/s3/response.s3.js";
import { variablesS3 } from "../../utils/params/const.database.js";
import multer from "multer";
import crypto from "crypto";
import path from "path";

// Configuración de AWS S3
const s3Client = new S3Client({
    region: variablesS3.region,
    credentials: {
        accessKeyId: variablesS3.access_key,
        secretAccessKey: variablesS3.secret_key
    }
});

// Configuración de Multer para almacenamiento temporal
const storage = multer.memoryStorage();
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 15 * 1024 * 1024, // Limitar a 5MB
    }
});

// Middleware para procesar errores de Multer
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'El archivo excede el tamaño máximo permitido (5MB)' });
        }
        return res.status(400).json({ error: err.message });
    }
    next(err);
};

// Función para generar un nombre de archivo único
const generateUniqueFileName = (originalName) => {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(originalName);
    return `${timestamp}-${randomString}${extension}`;
};

// Función para obtener el bucket dinámico según el parámetro `page`
const getBucketName = (page) => {
    if (page === 'academy') return variablesS3.bucketAcademy;
    if (page === 'landing') return variablesS3.bucketLanding;
    return null;
};

const getDomainName = (page) => {
    if (page === 'academy') return variablesS3.domain_name_academy;
    if (page === 'landing') return variablesS3.domain_name_landing;
    return null;
};

const getBucketNameByDomain = (domain) => {
    if (domain === variablesS3.domain_name_academy) {
        return variablesS3.bucketAcademy;
    }
    if (domain === variablesS3.domain_name_landing) {
        return variablesS3.bucketLanding;
    }
};

// Función para determinar la carpeta según el tipo de archivo
const getFileCategory = (mimetype) => {
    if (mimetype.startsWith('image/')) return 'images';
    if (mimetype.startsWith('video/')) return 'videos';
    if (mimetype.includes('svg') || mimetype.includes('icon')) return 'icons';
    return null;
};

// Leer imagen
export const readFileS3 = async (req, res) => {
    try {
        const { bucket, rute, filename } = req.params;
        const bucketName = getDomainName(bucket);
        if (!bucketName) {
            return res.status(400).json({ error: "Parámetro 'bucket' inválido. Debe ser 'academy' o 'landing'." });
        }
        const fileUrl = `https://${bucketName}/${rute}/${filename}`;
        res.status(200).json(responseS3File.success({ message: 'Archivo leído exitosamente', url: fileUrl }))
    } catch (error) {
        return res.status(500).json({ error: 'Error al leer el archivo de S3', msg: error.message });
    }
};


// Controlador para subir archivos a S3 desde otros endpoints
export const uploadFileS3Function = async (file) => {
    try {
        if (!file) {
            return { error: 'No se ha proporcionado ningún archivo' };
        }

        const { page } = file; // Se obtiene el parámetro `page`
        const bucketName = getBucketName(page);
        const domainName = getDomainName(page);
        if (!bucketName) {
            return responseS3File.error({ message: "Parámetro 'page' inválido. Debe ser 'academy' o 'landing'." });
        }

        const fileCategory = getFileCategory(file.mimetype);
        if (!fileCategory) {
            return responseS3File.error({ message: "Tipo de archivo no soportado. Solo se permiten imágenes, videos e iconos." });
        }

        const uniqueFileName = generateUniqueFileName(file.originalname);
        const objectKey = `${fileCategory}/${uniqueFileName}`;

        // Configuración para subir a S3
        const bucketParams = {
            Bucket: bucketName,
            Key: objectKey,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'private'
        };

        // Subir archivo a S3
        const command = new PutObjectCommand(bucketParams);
        await s3Client.send(command);

        // Generar URL del archivo
        const fileUrl = `https://${domainName}/${objectKey}`;

        return responseS3File.success({ message: 'Archivo subido exitosamente', url: fileUrl });
    } catch (error) {
        return responseS3File.error({ message: 'Error al subir el archivo a S3', msg: error.message });
    }
};

// Controlador para subir archivos a S3
export const uploadFileS3 = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
        }

        const { page } = req.body; // Se obtiene el parámetro `page`
        const bucketName = getBucketName(page);
        const domainName = getDomainName(page);
        if (!bucketName) {
            return res.status(400).json({ error: "Parámetro 'page' inválido. Debe ser 'academy' o 'landing'." });
        }

        const fileCategory = getFileCategory(req.file.mimetype);
        if (!fileCategory) {
            return res.status(400).json({ error: "Tipo de archivo no soportado. Solo se permiten imágenes, videos e iconos." });
        }

        const uniqueFileName = generateUniqueFileName(req.file.originalname);
        const objectKey = `${fileCategory}/${uniqueFileName}`;

        // Configuración para subir a S3
        const bucketParams = {
            Bucket: bucketName,
            Key: objectKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'private'
        };

        // Subir archivo a S3
        const command = new PutObjectCommand(bucketParams);
        await s3Client.send(command);

        // Generar URL del archivo
        const fileUrl = `https://${domainName}/${objectKey}`;

        res.status(200).json({
            message: 'Archivo subido exitosamente',
            fileUrl: fileUrl,
            fileName: uniqueFileName
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al subir el archivo a S3', msg: error.message });
    }
};

// Eliminar archivos a S3 desde otros endpoints
export const deleteFileS3Function = async (fileUrl) => {
    try {
        if (!fileUrl) {
            return responseS3File.error({ message: "Se requiere 'fileUrl' para eliminar la imagen." });
        }

        // Extraer el bucket y la key desde la URL
        const urlParts = new URL(fileUrl);
        const bucketName = getBucketNameByDomain(urlParts.host.split(".")[0] + '.cloudfront.net');
        const objectKey = urlParts.pathname.substring(1);

        if (!bucketName || !objectKey) {
            return responseS3File.error({ message: "No se pudo extraer el bucket o la clave del archivo desde la URL." });
        }

        // Configuración para eliminar el archivo de S3
        const deleteParams = {
            Bucket: bucketName,
            Key: objectKey
        };

        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);

        return responseS3File.success({ message: "Archivo eliminado exitosamente" });
    } catch (error) {
        return responseS3File.error({ message: "Error al eliminar el archivo en S3", msg: error.message });
    }
};

// Eliminar archivos a S3
export const deleteFileS3 = async (req, res) => {
    try {
        const { fileUrl } = req.body;

        if (!fileUrl) {
            return res.status(400).json({ error: "Se requiere 'fileUrl' para eliminar la imagen." });
        }

        // Extraer el bucket y la key desde la URL
        const urlParts = new URL(fileUrl);
        const bucketName = getBucketNameByDomain(urlParts.host.split(".")[0] + '.cloudfront.net');
        const objectKey = urlParts.pathname.substring(1);

        if (!bucketName || !objectKey) {
            return res.status(400).json({ error: "No se pudo extraer el bucket o la clave del archivo desde la URL." });
        }

        // Configuración para eliminar el archivo de S3
        const deleteParams = {
            Bucket: bucketName,
            Key: objectKey,
        };

        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);

        res.status(200).json({ message: "Archivo eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar el archivo:", error);
        res.status(500).json({ error: "Error al eliminar el archivo en S3", msg: error.message });
    }
};