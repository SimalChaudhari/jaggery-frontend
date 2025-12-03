import axios from 'src/utils/axios';

// Transform backend course data to frontend format
const transformCourse = (course) => ({
  id: course._id || course.id,
  title: course.title || '',
  description: course.description || '',
  image: course.image || '',
  freeOrPaid: course.freeOrPaid ?? false,
  amount: course.amount || 0,
  level: course.level || 'Beginner',
  createdAt: course.createdAt || new Date(),
  updatedAt: course.updatedAt || new Date(),
});

export const courseService = {
  async getAllCourses() {
    try {
      const response = await axios.get('/courses');
      const courses = response.data?.data || response.data || [];
      return courses.map(transformCourse);
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  async getCourseById(id) {
    try {
      const response = await axios.get(`/courses/${id}`);
      const course = response.data?.data || response.data;
      return transformCourse(course);
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  async createCourse(courseData, imageFile = null) {
    try {
      const formData = new FormData();

      // Append all course data fields
      formData.append('title', courseData.title || '');
      if (courseData.description) {
        formData.append('description', courseData.description);
      }
      if (courseData.freeOrPaid !== undefined) {
        formData.append('freeOrPaid', courseData.freeOrPaid);
      }
      if (courseData.amount !== undefined) {
        formData.append('amount', courseData.amount.toString());
      }
      if (courseData.level) {
        formData.append('level', courseData.level);
      }

      // Append image file if provided (not base64)
      if (imageFile instanceof File) {
        formData.append('image', imageFile);
      }

      const response = await axios.post('/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const course = response.data?.course || response.data?.data || response.data;
      return transformCourse(course);
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  async updateCourse(id, courseData, imageFile = null) {
    try {
      const formData = new FormData();

      // Append all course data fields
      if (courseData.title !== undefined) {
        formData.append('title', courseData.title);
      }
      if (courseData.description !== undefined) {
        formData.append('description', courseData.description);
      }
      if (courseData.freeOrPaid !== undefined) {
        formData.append('freeOrPaid', courseData.freeOrPaid);
      }
      if (courseData.amount !== undefined) {
        formData.append('amount', courseData.amount.toString());
      }
      if (courseData.level !== undefined) {
        formData.append('level', courseData.level);
      }

      // Append image file if provided (not base64)
      if (imageFile instanceof File) {
        formData.append('image', imageFile);
      }

      const response = await axios.put(`/courses/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const course = response.data?.course || response.data?.data || response.data;
      return transformCourse(course);
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  async deleteCourse(id) {
    try {
      const response = await axios.delete(`/courses/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },
};

