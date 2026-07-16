import apiClient from './apiClient';

/**
 * Onboard a new Educator
 * Method: POST
 * URL: /educator/onboard
 * @param {FormData} formData - Contains bio, expertise[i], file (profileImage)
 */
export const onboardEducator = async (formData) => {
  try {
    const response = await apiClient.post('/educator/onboard', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Educator onboarding error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to onboard educator.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get Educator details / status
 * Method: GET
 * URL: /educator/profile
 */
export const getEducatorProfile = async () => {
  try {
    const response = await apiClient.get('/educator/profile');
    return response.data;
  } catch (error) {
    console.error('Get educator profile error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch educator profile.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get all educators list
 * Method: GET
 * URL: /educator/list
 */
export const getAllEducators = async () => {
  try {
    const response = await apiClient.get('/educator/list');
    return response.data;
  } catch (error) {
    console.error('Fetch educators list error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch educators list.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get current educator's profile details
 * Method: GET
 * URL: /educator/my-profile
 */
export const getEducatorMyProfile = async () => {
  try {
    const response = await apiClient.get('/educator/my-profile');
    return response.data;
  } catch (error) {
    console.error('Fetch educator my profile error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch my profile.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Update an existing Educator profile details
 * Method: PUT
 * URL: /educator/update-profile
 * @param {FormData|object} data - Contains bio, expertise tags, and optionally profile image file
 */
export const updateEducatorProfile = async (data) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await apiClient.put('/educator/update-profile', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
    });
    return response.data;
  } catch (error) {
    console.error('Update educator profile error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update educator profile.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get Educator Dashboard Stats
 * Method: GET
 * URL: /educator/dashboard-stats
 */
export const getEducatorDashboardStats = async () => {
  try {
    const response = await apiClient.get('/educator/dashboard-stats');
    return response.data;
  } catch (error) {
    console.error('Get educator dashboard stats error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch dashboard stats.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get Educator details by ID
 * Method: GET
 * URL: /educator/details/:id
 * @param {string} id - Educator ID
 */
export const getEducatorDetails = async (id) => {
  try {
    const response = await apiClient.get(`/educator/details/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fetch educator details error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch educator details.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get public user course list
 * Method: GET
 * URL: /courses/public-user-course-list
 */
export const getPublicUserCourseList = async (params) => {
  try {
    const response = await apiClient.get('/courses/public-user-course-list', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch public user course list error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch courses.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Add a new course
 * Method: POST
 * URL: /courses/add-course
 * @param {FormData} formData - Contains course details and file (thumbnail)
 */
export const addCourse = async (formData) => {
  try {
    const response = await apiClient.post('/courses/add-course', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Add course error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to add course.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get all Course Categories
 * Method: GET
 * URL: /courses/get-all-course-categories
 */
export const getCourseCategories = async () => {
  try {
    const response = await apiClient.get('/courses/get-all-course-categories');
    return response.data;
  } catch (error) {
    console.error('Get course categories error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch course categories.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Update an existing course
 * Method: PUT
 * URL: /courses/update-course/:id
 * @param {string} id - Course ID
 * @param {FormData|object} data - Updated course details
 */
export const updateCourse = async (id, data) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await apiClient.put(`/courses/update-course/${id}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
    });
    return response.data;
  } catch (error) {
    console.error('Update course error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update course.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Delete a course by ID
 * Method: DELETE
 * URL: /courses/delete-course/:id
 * @param {string} id - Course ID
 */
export const deleteCourse = async (id) => {
  try {
    const response = await apiClient.delete(`/courses/delete-course/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete course error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to delete course.',
      statusCode: error.response?.status || 500
    };
  }
};/**
 * Create a new course section
 * Method: POST
 * URL: /course-section/create
 * @param {object} sectionData - Contains courseId, title, order
 */
export const createCourseSection = async (sectionData) => {
  try {
    const response = await apiClient.post('/course-section/create', sectionData);
    return response.data;
  } catch (error) {
    console.error('Create course section error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create course section.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get sections list for a course
 * Method: GET
 * URL: /course-section/list/:courseId
 * @param {string} courseId - The ID of the course
 */
export const getCourseSectionsList = async (courseId) => {
  try {
    const response = await apiClient.get(`/course-section/list/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch course sections error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch course sections.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Update an existing course section
 * Method: PUT
 * URL: /course-section/update/:sectionId
 * @param {string} sectionId - The ID of the section
 * @param {object} sectionData - Contains title, order
 */
export const updateCourseSection = async (sectionId, sectionData) => {
  try {
    const response = await apiClient.put(`/course-section/update/${sectionId}`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Update course section error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update course section.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Delete a course section by ID
 * Method: DELETE
 * URL: /course-section/delete/:sectionId
 * @param {string} sectionId - The ID of the section
 */
export const deleteCourseSection = async (sectionId) => {
  try {
    const response = await apiClient.delete(`/course-section/delete/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error('Delete course section error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to delete course section.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Create a new course lesson
 * Method: POST
 * URL: /course-lesson/create
 * @param {object} lessonData - Contains courseId, sectionId, title, description, videoUrl, videoId, durationInSeconds, order, isPreview
 */
export const createCourseLesson = async (lessonData) => {
  try {
    const response = await apiClient.post('/course-lesson/create', lessonData);
    return response.data;
  } catch (error) {
    console.error('Create course lesson error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create course lesson.',
      statusCode: error.response?.status || 500
    };
  }
};


/**
 * Get lessons list for a course
 * Method: GET
 * URL: /course-lesson/list/course/:courseId
 * @param {string} courseId - The ID of the course
 */
export const getCourseLessonsListByCourse = async (courseId) => {
  try {
    const response = await apiClient.get(`/course-lesson/list/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch course lessons by course error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch course lessons.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get lessons list for a section
 * Method: GET
 * URL: /course-lesson/list/section/:sectionId
 * @param {string} sectionId - The ID of the section
 */
export const getCourseLessonsListBySection = async (sectionId) => {
  try {
    const response = await apiClient.get(`/course-lesson/list/section/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch course lessons by section error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch section lessons.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Update an existing course lesson
 * Method: PUT
 * URL: /course-lesson/update/:lessonId
 * @param {string} lessonId - The ID of the lesson
 * @param {object} lessonData - Updated lesson details
 */
export const updateCourseLesson = async (lessonId, lessonData) => {
  try {
    const response = await apiClient.put(`/course-lesson/update/${lessonId}`, lessonData);
    return response.data;
  } catch (error) {
    console.error('Update course lesson error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update course lesson.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Delete a course lesson by ID
 * Method: DELETE
 * URL: /course-lesson/delete/:lessonId
 * @param {string} lessonId - The ID of the lesson
 */
export const deleteCourseLesson = async (lessonId) => {
  try {
    const response = await apiClient.delete(`/course-lesson/delete/${lessonId}`);
    return response.data;
  } catch (error) {
    console.error('Delete course lesson error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to delete course lesson.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Create a new course attachment
 * Method: POST
 * URL: /course-attachment/create
 * @param {object} attachmentData - Contains courseId, sectionId, lessonId, type, url, duration
 */
export const createCourseAttachment = async (attachmentData) => {
  try {
    const response = await apiClient.post('/course-attachment/create', attachmentData);
    return response.data;
  } catch (error) {
    console.error('Create course attachment error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create course attachment.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Update an existing course attachment
 * Method: PUT
 * URL: /course-attachment/update/:attachmentId
 * @param {string} attachmentId - The ID of the attachment
 * @param {object} attachmentData - Updated attachment details
 */
export const updateCourseAttachment = async (attachmentId, attachmentData) => {
  try {
    const response = await apiClient.put(`/course-attachment/update/${attachmentId}`, attachmentData);
    return response.data;
  } catch (error) {
    console.error('Update course attachment error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update course attachment.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get course attachments by course ID
 * Method: GET
 * URL: /course-attachment/list/course/:courseId
 */
export const getCourseAttachmentsListByCourse = async (courseId) => {
  try {
    const response = await apiClient.get(`/course-attachment/list/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch attachments by course error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch course attachments.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get course attachments by section ID
 * Method: GET
 * URL: /course-attachment/list/section/:sectionId
 */
export const getCourseAttachmentsListBySection = async (sectionId) => {
  try {
    const response = await apiClient.get(`/course-attachment/list/section/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch attachments by section error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch section attachments.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get course attachments by lesson ID
 * Method: GET
 * URL: /course-attachment/list/lesson/:lessonId
 */
export const getCourseAttachmentsListByLesson = async (lessonId) => {
  try {
    const response = await apiClient.get(`/course-attachment/list/lesson/${lessonId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch attachments by lesson error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch lesson attachments.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Delete a course attachment by ID
 * Method: DELETE
 * URL: /course-attachment/delete/:attachmentId
 * @param {string} attachmentId - The ID of the attachment
 */
export const deleteCourseAttachment = async (attachmentId) => {
  try {
    const response = await apiClient.delete(`/course-attachment/delete/${attachmentId}`);
    return response.data;
  } catch (error) {
    console.error('Delete course attachment error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to delete course attachment.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get public user course details by ID
 * Method: GET
 * URL: /courses/user-course-details/:id
 * @param {string} id - The Course ID
 */
export const getUserCourseDetails = async (id) => {
  try {
    const response = await apiClient.get(`/courses/user-course-details/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fetch user course details error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch course details.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Search courses by keyword
 * Method: GET
 * URL: /courses/search
 * @param {object} params - Contains keyword, page, and limit
 */
export const searchCourses = async (params) => {
  try {
    const response = await apiClient.get('/courses/search', { params });
    return response.data;
  } catch (error) {
    console.error('Search courses error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to search courses.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Purchase a course using wallet or other payment methods
 * Method: POST
 * URL: /course-enrollment/purchase
 * @param {object} purchaseData - Contains courseId and paymentMethod
 */
export const purchaseCourse = async (purchaseData) => {
  try {
    const response = await apiClient.post('/course-enrollment/purchase', purchaseData);
    return response.data;
  } catch (error) {
    console.error('Purchase course error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to purchase course.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Enroll in a course (for free courses or direct enrollment)
 * Method: POST
 * URL: /course-enrollment/enroll
 * @param {object} enrollData - Contains courseId
 */
export const enrollCourse = async (enrollData) => {
  try {
    const response = await apiClient.post('/course-enrollment/enroll', enrollData);
    return response.data;
  } catch (error) {
    console.error('Enroll course error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to enroll in course.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Update lesson progress for a course
 * Method: PUT
 * URL: /course-enrollment/update-progress
 * @param {object} progressData - Contains courseId, lessonId, isCompleted, watchedDurationInSeconds
 */
export const updateCourseProgress = async (progressData) => {
  try {
    const response = await apiClient.put('/course-enrollment/update-progress', progressData);
    return response.data;
  } catch (error) {
    console.error('Update progress error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update progress.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get user's active course enrollments
 * Method: GET
 * URL: /course-enrollment/my-enrollments
 */
export const getUserEnrollments = async () => {
  try {
    const response = await apiClient.get('/course-enrollment/my-enrollments');
    return response.data;
  } catch (error) {
    console.error('Fetch user enrollments error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch enrollments.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Create a comment on a course lesson
 * Method: POST
 * URL: /course-comment/create
 * @param {object} payload - Contains courseId, courseSectionId, courseLessonId, comment
 */
export const createCourseComment = async (payload) => {
  try {
    const response = await apiClient.post('/course-comment/create', payload);
    return response.data;
  } catch (error) {
    console.error('Create course comment error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create comment.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get comments list for a course lesson
 * Method: GET
 * URL: /course-comment/list/:courseLessonId
 * @param {string} courseLessonId - The Course Lesson ID
 */
export const getCourseCommentsList = async (courseLessonId) => {
  try {
    const response = await apiClient.get(`/course-comment/list/${courseLessonId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch course comments error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch comments.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Create a reply to a course comment
 * Method: POST
 * URL: /course-comment-reply/create
 * @param {object} payload - Contains courseId, courseSectionId, courseLessonId, comment, parentId
 */
export const createCourseCommentReply = async (payload) => {
  try {
    const response = await apiClient.post('/course-comment-reply/create', payload);
    return response.data;
  } catch (error) {
    console.error('Create comment reply error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create comment reply.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get replies list for a course comment
 * Method: GET
 * URL: /course-comment-reply/list/:commentId
 * @param {string} commentId - The parent Comment ID
 */
export const getCourseCommentRepliesList = async (commentId) => {
  try {
    const response = await apiClient.get(`/course-comment-reply/list/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch comment replies error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch comment replies.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Create a course review
 * Method: POST
 * URL: /course-review/create
 * @param {object} payload - Contains courseId, review, rating
 */
export const createCourseReview = async (payload) => {
  try {
    const response = await apiClient.post('/course-review/create', payload);
    return response.data;
  } catch (error) {
    console.error('Create course review error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create review.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Update a course review
 * Method: PUT
 * URL: /course-review/update/:reviewId
 * @param {string} reviewId - The Review ID
 * @param {object} payload - Contains review, rating
 */
export const updateCourseReview = async (reviewId, payload) => {
  try {
    const response = await apiClient.put(`/course-review/update/${reviewId}`, payload);
    return response.data;
  } catch (error) {
    console.error('Update course review error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update review.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Get reviews list for a course
 * Method: GET
 * URL: /course-review/list/:courseId
 * @param {string} courseId - The Course ID
 */
export const getCourseReviewsList = async (courseId) => {
  try {
    const response = await apiClient.get(`/course-review/list/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch course reviews error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch reviews.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Delete a course review
 * Method: DELETE
 * URL: /course-review/delete/:reviewId
 * @param {string} reviewId - The Review ID
 */
export const deleteCourseReview = async (reviewId) => {
  try {
    const response = await apiClient.delete(`/course-review/delete/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Delete course review error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to delete review.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Ask the Beauty AI assistant
 * Method: POST
 * URL: /ai-features/chat
 * @param {object} payload - Contains query
 */
export const askAiChat = async (payload) => {
  try {
    const response = await apiClient.post('/ai-features/chat', payload);
    return response.data;
  } catch (error) {
    console.error('AI chat error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to communicate with AI.',
      statusCode: error.response?.status || 500
    };
  }
};






