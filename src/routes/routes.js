import express from 'express';

// Middlewares
import { AuthorizationVerify } from '../middlewares/authorization.js';
import { ConexionVerify } from '../middlewares/connection.js';

// Admin Landing
import { updateAdminAboutUsFundador, updateAdminAboutUsObjetivos, updateAdminAboutUsMision, updateAdminAboutUsVision, getDataAboutUs } from '../controllers/admin/admin-aboutus.controller.js';
import { getUsersFromClub, getAllUsers, getAllRegistersVerifiedByDate, getAllCountUsersWithAdmin, getAllCountUsersWithoutAdmin } from '../controllers/academy/graphics.controller.js'
import { updateAdminHome, updateAdminNosotros, updateAdminComercial, updateAdminNews, updateAdminAcademia, updateAdminAliados, getDataHome } from '../controllers/admin/admin-home.controller.js'
import { updateAdminServicesInfo, updateAdminServicesOne, updateAdminServicesTwo, updateAdminServicesThree, getDataServices } from '../controllers/admin/admin-services.controller.js'
import { getAdminCourseAcademy, saveAdminCourse, deleteAdminCourse, updateAdminCourse } from '../controllers/admin/admin-course.controller.js';
import { getAdminClass, getAdminClassVideos, saveAdminClass, deleteAdminClass, updateAdminClass } from '../controllers/admin/admin-class.controller.js';
import { saveGalleryImage, deleteGalleryImage, getDataGallery } from '../controllers/admin/admin-gallery.controller.js';
import { saveNews, updateNews, deleteNews, getDataNews } from '../controllers/admin/admin-news.controller.js';
import { getAdminAcademy } from '../controllers/admin/admin.controller.js';

// Academy
import { getSolitudeUsersCoach, getSolitudeUsersClub, approvedSolitude, deniedSolitude, getCategoriesForRegister } from '../controllers/academy/solitud_register.controller.js';
import { getAllPermissionsAndRole, getPermissionsByIdUser, getPermissionsByRoleAdmin, getPermissionsByRoleUser } from '../controllers/academy/permissions.controller.js';
import { getClassMenu, getClassContent, getClassComments, saveClassComment } from '../controllers/academy/class.controller.js';
import { getCoach, searchCoachFilter, registerCoach } from '../controllers/academy/coach.controller.js';
import { updateUserLoginById, getUserInfo } from '../controllers/academy/configuration.controller.js';
import { getClub, searchClubFilter, registerClub } from '../controllers/academy/club.controller.js';
import { getAllRoles, getRoleUserByIdUser } from '../controllers/academy/role.controller.js';
import { getAthletes, registerAthlete } from '../controllers/academy/athletes.controller.js';
import { validLoginUsersAcademy } from '../controllers/academy/users.controller.js';
import { getCoursesAcademy } from '../controllers/academy/courses.controller.js';

// External
import { sendEmail } from '../lib/api/email.api.js';
import {
    getAllCountriesRestCountries,
    getCountriesAmericaRestCountries,
    getCountriesRegionRestCountries,
    getDateColombianRestCountries,
    getDateCityIDRestCountries,
    getCitiesColombianGeoNames,
    getCitiesOneCountryIDGeoNames,
    getCountriesRapidapi,
    getDepartmentColombianRapidapi,
    getCitiesOneCountryIDAndDepartmentIDRapidapi,
    getImageWithProxy
} from '../controllers/academy/external.controller.js';
import { uploadFileS3, deleteFileS3, upload, readFileS3, handleMulterError } from '../lib/s3/s3.js';


// Database
import { getConnect } from '../database/conection.controller.js';


const router = express();

export const routes = () => {
    // Admin Landing
    router.put('/landing/u/update-home/:id', AuthorizationVerify, upload.array('file'), handleMulterError, updateAdminHome);
    router.put('/landing/u/update-nosotros/:id', AuthorizationVerify, updateAdminNosotros);
    router.put('/landing/u/update-comercial/:id', AuthorizationVerify, upload.single('file'), handleMulterError, updateAdminComercial);
    router.put('/landing/u/update-news/:id', AuthorizationVerify, updateAdminNews);
    router.put('/landing/u/update-academia/:id', AuthorizationVerify, upload.single('file'), handleMulterError, updateAdminAcademia);
    router.put('/landing/u/update-aliados/:id', AuthorizationVerify, updateAdminAliados);
    router.put('/landing/u/update-services-info/:id', AuthorizationVerify, updateAdminServicesInfo);
    router.put('/landing/u/update-services-one/:id', AuthorizationVerify, upload.single('file'), handleMulterError, updateAdminServicesOne);
    router.put('/landing/u/update-services-two/:id', AuthorizationVerify, upload.single('file'), handleMulterError, updateAdminServicesTwo);
    router.put('/landing/u/update-services-three/:id', AuthorizationVerify, upload.single('file'), handleMulterError, updateAdminServicesThree);
    router.put('/landing/u/update-aboutus-fundador/:id', AuthorizationVerify, upload.single('file'), handleMulterError, updateAdminAboutUsFundador);
    router.put('/landing/u/update-aboutus-objetivos/:id', AuthorizationVerify, updateAdminAboutUsObjetivos);
    router.put('/landing/u/update-aboutus-mision/:id', AuthorizationVerify, upload.single('file'), handleMulterError, updateAdminAboutUsMision);
    router.put('/landing/u/update-aboutus-vision/:id', AuthorizationVerify, upload.single('file'), handleMulterError, updateAdminAboutUsVision);
    router.put('/landing/i/save-gallery/:id', AuthorizationVerify, upload.single('file'), handleMulterError, saveGalleryImage)
    router.put('/landing/d/delete-gallery/:id', AuthorizationVerify, deleteGalleryImage)
    router.post('/landing/i/save-news-admin/:id', AuthorizationVerify, upload.single('file'), handleMulterError, saveNews)
    router.put('/landing/u/update-news-admin/:id', AuthorizationVerify, upload.single('file'), handleMulterError, updateNews)
    router.delete('/landing/d/delete-news-admin/:id', AuthorizationVerify, deleteNews)
    router.get('/landing/g/aboutus', AuthorizationVerify, getDataAboutUs);
    router.get('/landing/g/gallery', AuthorizationVerify, getDataGallery)
    router.get('/landing/g/home', AuthorizationVerify, getDataHome);
    router.get('/landing/g/news', AuthorizationVerify, getDataNews);
    router.get('/landing/g/services', AuthorizationVerify, getDataServices);

    // Admin Academy
    router.get('/academy/g/admin-course', AuthorizationVerify, getAdminCourseAcademy);
    router.post('/academy/i/add-course', AuthorizationVerify, upload.single('file'), handleMulterError, saveAdminCourse);
    router.put('/academy/u/update-course/:id', AuthorizationVerify, upload.single('file'), handleMulterError, updateAdminCourse);
    router.delete('/academy/d/delete-course/:id', AuthorizationVerify, deleteAdminCourse);
    router.get('/academy/g/admin-class', AuthorizationVerify, getAdminClass);
    router.get('/academy/g/admin-class-videos/:id_course', AuthorizationVerify, getAdminClassVideos);
    router.post('/academy/i/add-class', AuthorizationVerify, upload.single('file'), handleMulterError, saveAdminClass);
    router.put('/academy/u/update-class/:id', AuthorizationVerify, upload.single('file'), handleMulterError, updateAdminClass);
    router.delete('/academy/d/delete-class/:id', AuthorizationVerify, deleteAdminClass);

    // Academy
    router.get('/academy/g/admin', getAdminAcademy);
    router.get('/academy/g/role', getAllRoles);
    router.get('/academy/g/athletes', getAthletes);
    router.post('/academy/register/athletes', registerAthlete);
    router.get('/academy/g/club', getClub);
    router.get('/academy/g/search/club/:filter', searchClubFilter);
    router.post('/academy/register/club', registerClub);
    router.get('/academy/g/coach', getCoach);
    router.get('/academy/g/search/coach/:filter', searchCoachFilter);
    router.post('/academy/register/coach', registerCoach);
    router.post('/academy/users/login', AuthorizationVerify, validLoginUsersAcademy);
    router.get('/academy/g/courses', AuthorizationVerify, getCoursesAcademy);
    router.get('/academy/g/class/menu', AuthorizationVerify, getClassMenu);
    router.get('/academy/g/class/content', AuthorizationVerify, getClassContent);
    router.get('/academy/g/class/comments', AuthorizationVerify, getClassComments);
    router.post('/academy/i/class/post-comments', AuthorizationVerify, saveClassComment)
    router.get('/academy/solitude/register/users/coach', AuthorizationVerify, getSolitudeUsersCoach);
    router.get('/academy/solitude/register/users/club', AuthorizationVerify, getSolitudeUsersClub);
    router.post('/academy/solitude/approved', AuthorizationVerify, approvedSolitude);
    router.post('/academy/solitude/denied', AuthorizationVerify, deniedSolitude);
    router.get('/academy/permissions/roles', AuthorizationVerify, getAllPermissionsAndRole);
    router.post('/academy/permissions/user/:id_user', AuthorizationVerify, getPermissionsByIdUser);
    router.get('/academy/permissions/user/admin', AuthorizationVerify, getPermissionsByRoleAdmin);
    router.get('/academy/permissions/user/:role_id', AuthorizationVerify, getPermissionsByRoleUser);
    router.post('/academy/config/user/p/login', AuthorizationVerify, updateUserLoginById);
    router.get('/academy/config/user/g/login/:id_user', AuthorizationVerify, getUserInfo);
    router.get('/academy/user/role/:id_user', AuthorizationVerify, getRoleUserByIdUser);
    router.get('/academy/user/categories', AuthorizationVerify, getCategoriesForRegister);

    //Graphics
    router.get('/academy/g/users-from-club/:id_club', AuthorizationVerify, getUsersFromClub);
    router.get('/academy/g/all-users', AuthorizationVerify, getAllUsers);
    router.get('/academy/graphics/registers/mounth/year', AuthorizationVerify, getAllRegistersVerifiedByDate);
    router.get('/academy/graphics/role/registers/club', AuthorizationVerify, getAllCountUsersWithoutAdmin);
    router.get('/academy/graphics/role/registers/admin', AuthorizationVerify, getAllCountUsersWithAdmin);

    //External
    router.post('/external/p/send/mail', AuthorizationVerify, sendEmail)
    router.get('/external/g/rest/countries/', AuthorizationVerify, getAllCountriesRestCountries);
    router.get('/external/g/rest/countries/america', AuthorizationVerify, getCountriesAmericaRestCountries);
    router.get('/external/g/restcountries/countries/:region', AuthorizationVerify, getCountriesRegionRestCountries);
    router.get('/external/g/rest/country/data/col', AuthorizationVerify, getDateColombianRestCountries);
    router.get('/external/g/rest/country/data/:contryID', AuthorizationVerify, getDateCityIDRestCountries);
    router.get('/external/g/geon/cities/col/', AuthorizationVerify, getCitiesColombianGeoNames);
    router.get('/external/g/geon/cities/:countryID', AuthorizationVerify, getCitiesOneCountryIDGeoNames);
    router.get('/external/g/rapi/countries/', AuthorizationVerify, getCountriesRapidapi);
    router.get('/external/g/rapi/depart/col/', AuthorizationVerify, getDepartmentColombianRapidapi);
    router.get('/external/g/rapi/cities/depart/:departmentID/:countryID', AuthorizationVerify, getCitiesOneCountryIDAndDepartmentIDRapidapi);
    router.get('/external/g/instagram/proxy-img', getImageWithProxy);

    //S3
    router.post('/external/p/s3/', AuthorizationVerify, upload.single('file'), handleMulterError, uploadFileS3);
    router.post('/external/d/s3/', AuthorizationVerify, deleteFileS3);
    router.get('/external/g/s3/:bucket/:rute/:filename/', AuthorizationVerify, readFileS3);

    // Database
    router.get('/conect/', ConexionVerify, getConnect);
    return router;
}