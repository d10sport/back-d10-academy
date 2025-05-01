import getConnection from "../../database/connection.mysql.js";
import { variablesDB } from "../../utils/params/const.database.js";
import { responseQueries } from "../../common/enum/queries/response.queries.js";
import { deleteFileS3Function, uploadFileS3Function } from "../../lib/s3/s3.js";

// Obtener cursos
export const getAdminCourseAcademy = async (req, res) => {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`SELECT * FROM ${db}.course_user`);
  if (!select) return res.json({
    status: 500,
    message: 'Error obteniendo los cursos',
  });
  return res.json(select[0]);
}

// Guardar un curso
export const saveAdminCourse = async (req, res) => {
  const file = req.file;
  const data = JSON.parse(req.body.data);
  const { course_title, main_photo, description_course } = data;

  // const deleteFiles3 = await deleteFileS3Function(main_photo);
  // if (deleteFiles3.error) {
  //   return res.json(responseQueries.error({ message: deleteFiles3.message }));
  // }

  const linkFile = await uploadFileS3Function({ page: req.body.page, ...file });
  if (linkFile.error) {
    return res.json(responseQueries.error({ message: linkFile.error }));
  }

  if (!course_title || !linkFile.url || !description_course) {
    return res.json(responseQueries.error({ message: "Datos incompletos" }));
  }

  const mainPhotoJSON = JSON.stringify({ bg_photo: linkFile.url });

  const conn = await getConnection();
  const db = variablesDB.academy;

  const insert = await conn.query(
    `INSERT INTO ${db}.course_user (course_title, main_photo, description_course) VALUES (?, ?, ?)`,
    [course_title, mainPhotoJSON, description_course]
  );

  if (!insert) return res.json(responseQueries.error({ message: "Error al crear curso" }));

  return res.json(responseQueries.success({ message: "Curso creado con éxito" }));
};

// Eliminar un curso
export const deleteAdminCourse = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: 400,
      message: 'El ID es obligatorio'
    });
  }

  try {
    const conn = await getConnection();
    const db = variablesDB.academy;

    const result = await conn.query(`DELETE FROM ${db}.course_user WHERE id = ?`, [id]);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Curso no encontrado'
      });
    }

    return res.json({
      status: 200,
      message: (`Curso #${id} eliminado correctamente`)
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Error al eliminar el curso',
      error: error.message
    });
  }
};

// Actualizar un curso
// export const updateAdminCourse = async (req, res) => {
//   const { id } = req.params;
//   const { course_title, main_photo, description_course } = req.body;

//   if (!id || !course_title || !main_photo || !description_course) {
//     return res.json(responseQueries.error({ message: "Datos incompletos" }));
//   }

//   const mainPhotoJSON = JSON.stringify({ bg_photo: main_photo });

//   try {
//     const conn = await getConnection();
//     const db = variablesDB.academy;

//     const update = await conn.query(
//       `UPDATE ${db}.course_user SET course_title = ?, main_photo = ?, description_course = ? WHERE id = ?`,
//       [course_title, mainPhotoJSON, description_course, id]
//     );

//     if (update.affectedRows === 0) {
//       return res.json(responseQueries.error({ message: "No se encontró el curso" }));
//     }

//     return res.json(responseQueries.success({ message: "Curso actualizado con éxito" }));
//   } catch (error) {
//     return res.json(responseQueries.error({ message: "Error al actualizar curso", error }));
//   }
// };